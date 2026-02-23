"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatList from "../../components/chat/ChatList";
import ChatConversation from "../../components/chat/ChatConversation";
import { CHATS_DATA, Message, Chat, User } from "./mockData";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { fetchCurrentUser, searchUsers, fetchConversations, type CurrentUser } from "@/lib/api";
import type { Socket } from "socket.io-client";

/** Stable AI room key — never collides with UUIDs. */
const AI_ROOM = "ai-0";

const ChatPage = () => {
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>(CHATS_DATA);

  /**
   * Messages are keyed by ROOM STRING (e.g. "uuid1--uuid2"), not by chat.id.
   * This matches what the socket server emits as `chatId`.
   */
  const [allMessages, setAllMessages] = useState<{ [roomId: string]: Message[] }>({
    [AI_ROOM]: CHATS_DATA[0].messages,
  });

  /** Room string of the chat where the other person is currently typing. */
  const [typingRoomId, setTypingRoomId] = useState<string | null>(null);
  /** Rooms whose message history is currently being fetched from the server. */
  const [loadingRoomIds, setLoadingRoomIds] = useState<Set<string>>(new Set());

  /** User search state */
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearchFetching, setIsSearchFetching] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Always holds the latest chats without causing effect re-runs. */
  const chatsRef = useRef<Chat[]>(chats);
  useEffect(() => { chatsRef.current = chats; }, [chats]);
  /** Always holds the latest allMessages without causing effect re-runs. */
  const allMessagesRef = useRef<{ [roomId: string]: Message[] }>(allMessages);
  useEffect(() => { allMessagesRef.current = allMessages; }, [allMessages]);

  /**
   * Derives the deterministic private room ID for any chat.
   * Sorting the two UUIDs ensures both participants always compute the same string.
   */
  const getRoomId = useCallback(
    (chat: Chat): string => {
      if (chat.isAi) return AI_ROOM;
      if (chat.userId && currentUser?.id) {
        return [currentUser.id, chat.userId].sort().join("--");
      }
      return String(chat.id); // fallback
    },
    [currentUser]
  );

  // ── Step 1: Load real current user from backend ──────────────────────────
  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
      // If null, the user is not logged in — let auth redirect handle it
    });
  }, []);

  // ── Step 1c: Auto-start a chat from URL params (e.g. from profile modal) ─
  useEffect(() => {
    const userId = searchParams.get("userId");
    const name = searchParams.get("name");
    const initials = searchParams.get("initials") ?? "?";
    const role = searchParams.get("role") ?? "";
    const avatarUrl = searchParams.get("avatarUrl") ?? undefined;
    if (!userId || !name) return;

    setChats((prev) => {
      const existing = prev.find((c) => c.userId === userId);
      if (existing) {
        // Delay to let state settle before selecting
        setTimeout(() => setSelectedChatId(existing.id), 50);
        return prev;
      }
      const newId = Date.now();
      const newChat: Chat = {
        id: newId,
        userId,
        name,
        initials,
        avatarUrl,
        online: false,
        lastMessage: "Say hello!",
        time: "Now",
        messages: [],
      };
      setTimeout(() => setSelectedChatId(newId), 50);
      return [...prev, newChat];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Step 1b: Load past conversations once we know who the current user is ─
  useEffect(() => {
    if (!currentUser) return;
    fetchConversations().then((convos) => {
      if (!convos.length) return;
      setChats((prev) => {
        const aiChat = prev.find((c) => c.isAi);
        // Keep all existing non-AI chats (preserves manually-started ones)
        const existingNonAi = prev.filter((c) => !c.isAi);
        const existingUserIds = new Set(existingNonAi.map((c) => c.userId).filter(Boolean));
        // Only add conversations that aren't already present
        let nextId = Math.max(1, ...existingNonAi.map((c) => c.id)) + 1;
        const newChats: Chat[] = convos
          .filter((co) => !existingUserIds.has(co.userId))
          .map((co) => ({
            id: nextId++,
            userId: co.userId,
            name: co.name,
            initials: co.initials,
            avatarUrl: co.avatar_url,
            lastMessage: co.lastMessage,
            time: co.time,
            messages: [],
          }));
        return aiChat ? [aiChat, ...existingNonAi, ...newChats] : [...existingNonAi, ...newChats];
      });
    });
  }, [currentUser]);

  // ── Step 2: Connect socket once we have the real user identity ────────────
  useEffect(() => {
    if (!currentUser) return;

    // Re-create socket with real identity
    disconnectSocket();
    const socket = getSocket(currentUser.id, currentUser.name);
    socketRef.current = socket;

    if (!socket.connected) socket.connect();

    /** New message broadcast — chatId is the room string from the server. */
    const onReceiveMessage = (msg: {
      id: number;
      chatId: string;
      text: string;
      senderId: string;
      timestamp: string;
    }) => {
      setAllMessages((prev) => {
        const existing = prev[msg.chatId] ?? [];
        if (existing.some((m) => m.id === msg.id)) return prev; // deduplicate
        return {
          ...prev,
          [msg.chatId]: [
            ...existing,
            {
              id: msg.id,
              text: msg.text,
              sender: msg.senderId === currentUser.id ? "me" : "them",
              timestamp: msg.timestamp,
            },
          ],
        };
      });

      // Update the chat's lastMessage preview and bubble it to the top
      setChats((prev) => {
        const updated = prev.map((c) => {
          const roomId = c.isAi
            ? AI_ROOM
            : c.userId && currentUser?.id
            ? [currentUser.id, c.userId].sort().join("--")
            : String(c.id);
          if (roomId !== msg.chatId) return c;
          return { ...c, lastMessage: msg.text, time: msg.timestamp };
        });
        // Keep AI chat pinned at index 0; sort the rest so the updated chat is first
        const aiChats = updated.filter((c) => c.isAi);
        const nonAi = updated.filter((c) => !c.isAi);
        const idx = nonAi.findIndex((c) => {
          const roomId = c.userId && currentUser?.id
            ? [currentUser.id, c.userId].sort().join("--")
            : String(c.id);
          return roomId === msg.chatId;
        });
        if (idx > 0) {
          const [moved] = nonAi.splice(idx, 1);
          nonAi.unshift(moved);
        }
        return [...aiChats, ...nonAi];
      });
    };

    /** Typing indicator — chatId is the room string. */
    const onUserTyping = ({ chatId }: { chatId: string }) => {
      setTypingRoomId(chatId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingRoomId(null), 3000);
    };

    const onUserStopTyping = ({ chatId }: { chatId: string }) => {
      setTypingRoomId((prev) => (prev === chatId ? null : prev));
    };

    /** History loaded from server after join_chat — chatId is the room string. */
    const onChatHistory = ({
      chatId,
      messages,
    }: {
      chatId: string;
      messages: Array<{ id: number; text: string; senderId: string; timestamp: string }>;
    }) => {
      setLoadingRoomIds((prev) => {
        const next = new Set(prev);
        next.delete(chatId);
        return next;
      });
      if (!messages.length) return;
      setAllMessages((prev) => ({
        ...prev,
        [chatId]: messages.map((m) => ({
          id: m.id,
          text: m.text,
          sender: m.senderId === currentUser.id ? "me" : "them",
          timestamp: m.timestamp,
        })),
      }));
    };

    socket.on("receive_message", onReceiveMessage);
    socket.on("user_typing", onUserTyping);
    socket.on("user_stop_typing", onUserStopTyping);
    socket.on("chat_history", onChatHistory);

    return () => {
      socket.off("receive_message", onReceiveMessage);
      socket.off("user_typing", onUserTyping);
      socket.off("user_stop_typing", onUserStopTyping);
      socket.off("chat_history", onChatHistory);
    };
  }, [currentUser]);

  // ── Step 3: Join / leave room when selected chat changes ─────────────────
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || selectedChatId === null) return;
    // Use chatsRef to avoid re-running this effect on every chat list reorder.
    // We only want to join when the *selected chat* actually changes.
    const chat = chatsRef.current.find((c) => c.id === selectedChatId);
    if (chat && !chat.isAi) {
      const roomId = getRoomId(chat);
      // Only show loading spinner if we don't already have cached messages
      const alreadyCached = (allMessagesRef.current[roomId]?.length ?? 0) > 0;
      if (!alreadyCached) {
        setLoadingRoomIds((prev) => new Set(prev).add(roomId));
        // Fallback: clear loading after 4 s in case chat_history never arrives
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = setTimeout(() => {
          setLoadingRoomIds((prev) => {
            const next = new Set(prev);
            next.delete(roomId);
            return next;
          });
        }, 4000);
      }
      socket.emit("join_chat", { chatId: roomId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId, getRoomId]);

  // ── Derived values ────────────────────────────────────────────────────────
  const selectedChat = chats.find((c) => c.id === selectedChatId) ?? null;
  const selectedRoomId = selectedChat ? getRoomId(selectedChat) : null;
  const selectedMessages = selectedRoomId ? (allMessages[selectedRoomId] ?? []) : [];

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSocketSend = useCallback(
    (text: string) => {
      if (!selectedChat) return;
      socketRef.current?.emit("send_message", {
        chatId: getRoomId(selectedChat),
        text,
        senderId: currentUser?.id ?? "anonymous",
        senderName: currentUser?.name ?? "User",
      });
    },
    [selectedChat, getRoomId, currentUser]
  );

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!selectedChat) return;
      const event = isTyping ? "typing" : "stop_typing";
      socketRef.current?.emit(event, {
        chatId: getRoomId(selectedChat),
        senderId: currentUser?.id ?? "anonymous",
      });
    },
    [selectedChat, getRoomId, currentUser]
  );

  /** Debounced backend user search — called by ChatList on every keystroke. */
  const handleSearchChange = useCallback((q: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearchFetching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchUsers(q);
      // Exclude users already in the chat list
      const existingIds = new Set(chats.map((c) => c.userId).filter(Boolean));
      setSearchResults(
        results
          .filter((u) => !existingIds.has(u.id))
          .map((u) => ({ ...u, avatarUrl: u.avatar_url }))
      );
      setIsSearchFetching(false);
    }, 300);
  }, [chats]);

  /** Start a new 1-on-1 chat with a user from search results. */
  const handleStartNewChat = useCallback(
    (user: User) => {
      const existing = chats.find((c) => c.userId === user.id);
      if (existing) {
        setSelectedChatId(existing.id);
        return;
      }
      const newId = Date.now();
      const newChat: Chat = {
        id: newId,
        userId: user.id,
        name: user.name,
        initials: user.initials,
        avatarUrl: user.avatarUrl,
        online: user.online,
        lastMessage: "Say hello!",
        time: "Now",
        messages: [],
      };
      setChats((prev) => [...prev, newChat]);
      setAllMessages((prev) => ({ ...prev, [`${newId}`]: [] }));
      setSelectedChatId(newId);
    },
    [chats]
  );

  /** Used only for AI chat where messages are managed locally. */
  const handleUpdateMessages = useCallback(
    (roomId: string, newMessages: Message[]) => {
      setAllMessages((prev) => ({ ...prev, [roomId]: newMessages }));
    },
    []
  );

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex w-full overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`w-full md:w-95 shrink-0 h-full ${
            selectedChatId !== null ? "hidden md:flex" : "flex"
          }`}
        >
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            searchResults={searchResults}
            onSearchChange={handleSearchChange}
            isSearching={isSearchFetching}
            onStartNewChat={handleStartNewChat}
          />
        </div>

        {/* Conversation Area */}
        <div
          className={`flex-1 h-full ${
            selectedChatId === null ? "hidden md:flex" : "flex"
          } relative`}
        >
          <ChatConversation
            chat={selectedChat}
            messages={selectedMessages}
            onUpdateMessages={(newMsgs) =>
              selectedRoomId && handleUpdateMessages(selectedRoomId, newMsgs)
            }
            onSendMessage={handleSocketSend}
            onTyping={handleTyping}
            isTyping={!!selectedRoomId && typingRoomId === selectedRoomId}
            isMessagesLoading={!!selectedRoomId && loadingRoomIds.has(selectedRoomId)}
            onBack={() => setSelectedChatId(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default function ChatPageWrapper() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}
