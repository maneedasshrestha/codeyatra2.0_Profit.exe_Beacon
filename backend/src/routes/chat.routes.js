import { Router } from "express";
import { getChatMessages, clearChatMessages } from "../controllers/chat.controllers.js";

const chatRouter = Router();

// GET /api/chat/:chatId/messages — fetch history on page load
chatRouter.get("/:chatId/messages", getChatMessages);

// DELETE /api/chat/:chatId/messages — clear history (dev/test)
chatRouter.delete("/:chatId/messages", clearChatMessages);

export default chatRouter;
