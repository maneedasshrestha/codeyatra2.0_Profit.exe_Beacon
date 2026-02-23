import { getMessages } from "../socket/chatHandler.js";
import supabase from "../utils/supabase.js";

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
