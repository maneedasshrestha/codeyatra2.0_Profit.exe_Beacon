import { Router } from "express";
import { getChatMessages, clearChatMessages, getConversations } from "../controllers/chat.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const chatRouter = Router();

// GET /api/chat/conversations — list all conversations for the logged-in user
chatRouter.get("/conversations", requireAuth, getConversations);

// GET /api/chat/:chatId/messages — fetch history on page load
chatRouter.get("/:chatId/messages", getChatMessages);

// DELETE /api/chat/:chatId/messages — clear history (dev/test)
chatRouter.delete("/:chatId/messages", clearChatMessages);

export default chatRouter;
