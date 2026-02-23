import { getMessages } from "../socket/chatHandler.js";
import supabase from "../utils/supabase.js";

/**
 * GET /api/chat/conversations
 * Returns all conversations for the authenticated user,
 * including the other participant's profile and the latest message.
 */
export const getConversations = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // 1. Fetch all conversations this user is part of (most-recently updated first)
  const { data: convos, error: convosError } = await supabase
    .from("conversations")
    .select("id, user1_id, user2_id, updated_at")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (convosError) {
    console.error("getConversations error:", convosError.message);
    return res.status(500).json({ error: "Failed to fetch conversations" });
  }

  if (!convos || convos.length === 0) {
    return res.status(200).json({ conversations: [] });
  }

  // 2. Collect the other participant IDs
  const otherUserIds = convos.map((c) =>
    c.user1_id === userId ? c.user2_id : c.user1_id
  );

  // 3. Fetch profiles for those users
  const { data: profiles } = await supabase
    .from("users")
    .select("id, name, role")
    .in("id", otherUserIds);

  const profileMap = Object.fromEntries(
    (profiles || []).map((p) => [p.id, p])
  );

  // 4. Fetch the latest message for each conversation
  const results = await Promise.all(
    convos.map(async (c) => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("text, created_at, sender_id, sender_name")
        .eq("conversation_id", c.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const lastMsg = msgs?.[0] ?? null;
      const otherId = c.user1_id === userId ? c.user2_id : c.user1_id;
      const profile = profileMap[otherId];
      const name = profile?.name || "Unknown User";
      const initials = name
        .split(" ")
        .map((w) => w[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("");

      return {
        roomId: c.id,
        userId: otherId,
        name,
        initials,
        role: profile?.role ?? null,
        lastMessage: lastMsg?.text ?? "Say hello!",
        lastMessageSenderId: lastMsg?.sender_id ?? null,
        time: lastMsg
          ? new Date(lastMsg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        updatedAt: c.updated_at,
      };
    })
  );

  return res.status(200).json({ conversations: results });
};

/**
 * GET /api/chat/:chatId/messages
 * Returns the message history for a chat room from Supabase.
 */
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  const messages = await getMessages(chatId);
  return res.status(200).json({ chatId, messages });
};

/**
 * DELETE /api/chat/:chatId/messages
 * Clears the message history for a room (for testing purposes).
 */
export const clearChatMessages = async (req, res) => {
  const { chatId } = req.params;
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", chatId);
  if (error) return res.status(500).json({ error: "Failed to clear messages" });
  return res.status(200).json({ message: "Chat history cleared." });
};
