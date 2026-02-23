import supabase from "../utils/supabase.js";

/**
 * Ensures a conversation row exists for the given room ID.
 * roomId format: "uuid1--uuid2" (sorted lexicographically by caller).
 */
const ensureConversation = async (roomId) => {
  const [user1_id, user2_id] = roomId.split("--");
  if (!user1_id || !user2_id) return;

  // upsert — safe to call every time a user joins
  await supabase.from("conversations").upsert(
    { id: roomId, user1_id, user2_id },
    { onConflict: "id", ignoreDuplicates: true }
  );
};

/**
 * Loads message history for a room from Supabase.
 */
const getMessages = async (chatId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, sender_name, text, created_at")
    .eq("conversation_id", chatId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Failed to load chat history:", error.message);
    return [];
  }

  return (data || []).map((m) => ({
    id: m.id,
    chatId,
    text: m.text,
    senderId: m.sender_id,
    senderName: m.sender_name,
    timestamp: new Date(m.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    createdAt: m.created_at,
  }));
};

/**
 * Persists a single message to Supabase and returns the saved row.
 */
const saveMessage = async ({ chatId, text, senderId, senderName }) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: chatId,
      sender_id: senderId,
      sender_name: senderName,
      text,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("Failed to save message:", error.message);
    return null;
  }
  return data;
};

/**
 * Registers all chat-related socket event handlers for a connected socket.
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 */
export const registerChatHandlers = (io, socket) => {
  /**
   * join_chat — Client joins a room for the given chatId.
   * Payload: { chatId: string }
   */
  socket.on("join_chat", async ({ chatId }) => {
    if (!chatId) return;
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room: ${chatId}`);

    // Ensure the conversation row exists in DB
    await ensureConversation(chatId);

    // Send existing messages to the joining client
    const history = await getMessages(chatId);
    socket.emit("chat_history", { chatId, messages: history });
  });

  /**
   * leave_chat — Client leaves a room.
   * Payload: { chatId: string }
   */
  socket.on("leave_chat", ({ chatId }) => {
    if (!chatId) return;
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left room: ${chatId}`);
  });

  /**
   * send_message — Client sends a message in a chat room.
   * Payload: { chatId: string, text: string, senderId: string, senderName: string }
   */
  socket.on("send_message", async ({ chatId, text, senderId, senderName }) => {
    if (!chatId || !text?.trim()) return;

    const saved = await saveMessage({ chatId, text: text.trim(), senderId, senderName });

    const message = {
      id: saved?.id ?? Date.now(),
      chatId,
      text: text.trim(),
      senderId,
      senderName,
      timestamp: new Date(saved?.created_at ?? Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: saved?.created_at ?? new Date().toISOString(),
    };

    // Broadcast to everyone in the room (including sender)
    io.to(chatId).emit("receive_message", message);
  });

  /**
   * typing — Notify others in the room that this user is typing.
   * Payload: { chatId: string, senderId: string, senderName: string }
   */
  socket.on("typing", ({ chatId, senderId, senderName }) => {
    if (!chatId) return;
    socket.to(chatId).emit("user_typing", { chatId, senderId, senderName });
  });

  /**
   * stop_typing — Notify others that the user stopped typing.
   * Payload: { chatId: string, senderId: string }
   */
  socket.on("stop_typing", ({ chatId, senderId }) => {
    if (!chatId) return;
    socket.to(chatId).emit("user_stop_typing", { chatId, senderId });
  });
};

/**
 * Exposed so the REST controller can query message history from Supabase.
 */
export { getMessages };
