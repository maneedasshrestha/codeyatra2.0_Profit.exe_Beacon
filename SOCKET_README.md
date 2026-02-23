# Socket.IO Chat — How It Works

## Overview

Real-time messaging is powered by **Socket.IO** running on the same Express server (port `5000`). The frontend connects via a singleton `socket.io-client` instance and communicates through named events.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                  │
│                                                     │
│  ChatPage (page.tsx)                                │
│    ├── getSocket()  ──────────────────────────────┐ │
│    ├── socket.emit("join_chat")                   │ │
│    ├── socket.emit("send_message")                │ │
│    ├── socket.emit("typing")                      │ │
│    └── socket.on("receive_message")               │ │
│                                                   │ │
│  ChatConversation.tsx                             │ │
│    ├── onSendMessage() → parent emits via socket  │ │
│    ├── onTyping()      → parent emits via socket  │ │
│    └── isTyping prop   → shows "..." indicator    │ │
└─────────────────────────────────────────────────────┘
                           │  WebSocket (ws://)
                           ▼
┌─────────────────────────────────────────────────────┐
│              Express + Socket.IO Server             │
│                                                     │
│  index.js                                           │
│    └── io.on("connection") → registerChatHandlers() │
│                                                     │
│  socket/chatHandler.js                              │
│    ├── "join_chat"    → socket.join(room)           │
│    │                  → emit "chat_history" back    │
│    ├── "send_message" → save to store               │
│    │                  → io.to(room).emit(...)       │
│    ├── "typing"       → socket.to(room).emit(...)   │
│    └── "stop_typing"  → socket.to(room).emit(...)   │
└─────────────────────────────────────────────────────┘
```

---

## File Map

| File | Role |
|------|------|
| `backend/src/index.js` | Creates HTTP server, attaches Socket.IO, registers handlers on each connection |
| `backend/src/socket/chatHandler.js` | All socket event logic + in-memory message store |
| `backend/src/controllers/chat.controllers.js` | REST endpoints to read/clear message history |
| `backend/src/routes/chat.routes.js` | Mounts REST chat routes at `/api/chat` |
| `frontend/lib/socket.ts` | Singleton socket client — call `getSocket()` anywhere |
| `frontend/app/dashboard/chat/page.tsx` | Connects socket, manages rooms, owns all socket state |
| `frontend/app/components/chat/ChatConversation.tsx` | Renders messages, handles input, delegates send/typing to parent |

---

## Socket Events Reference

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_chat` | `{ chatId: string }` | Join a chat room. Server responds with `chat_history`. |
| `leave_chat` | `{ chatId: string }` | Leave a chat room. |
| `send_message` | `{ chatId, text, senderId, senderName }` | Send a message. Broadcasts to all room members. |
| `typing` | `{ chatId, senderId, senderName }` | Notify others that this user is typing. |
| `stop_typing` | `{ chatId, senderId }` | Notify others that this user stopped typing. |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `chat_history` | `{ chatId, messages[] }` | Sent to a client immediately after `join_chat`. |
| `receive_message` | `{ id, chatId, text, senderId, senderName, timestamp }` | New message broadcast to everyone in the room. |
| `user_typing` | `{ senderId, senderName }` | Another user in the room is typing. |
| `user_stop_typing` | `{ senderId }` | Another user stopped typing. |

---

## Message Flow — Step by Step

### Opening a Chat
```
1. User clicks a chat in the sidebar
2. selectedChatId state is set in ChatPage
3. useEffect fires → socket.emit("join_chat", { chatId })
4. Server: socket.join(chatId) and emits "chat_history" back
5. Client: onChatHistory() updates allMessages state
6. ChatConversation renders the messages
```

### Sending a Message
```
1. User types text and presses Enter / Send button
2. ChatConversation calls onSendMessage(text) → prop from ChatPage
3. ChatPage: socket.emit("send_message", { chatId, text, senderId, senderName })
4. Server chatHandler receives "send_message"
   a. Creates message object with id, timestamp
   b. Pushes to in-memory messageStore[chatId]
   c. io.to(chatId).emit("receive_message", message)  ← all room members
5. Client onReceiveMessage:
   - If senderId === SESSION_USER_ID → sender: "me"
   - Otherwise → sender: "them"
   - Deduplicates by id before adding to state
6. ChatConversation re-renders with the new message
```

### Typing Indicator
```
1. User types a character in the input
2. handleTextChange fires onTyping(true) with a 2-second debounce for stop
3. ChatPage: socket.emit("typing", { chatId, senderId })
4. Server: socket.to(chatId).emit("user_typing", ...) ← everyone except sender
5. Other clients: onUserTyping sets typingChatId, auto-clears after 3 seconds
6. isTyping prop is passed to ChatConversation → shows bouncing dots
```

---

## REST Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/chat/:chatId/messages` | Fetch stored messages for a room |
| `DELETE` | `/api/chat/:chatId/messages` | Clear a room's message history (dev/testing) |

---

## AI Chat vs Real Chat

The distinction is made via `chat.isAi` on the `Chat` object:

- **`isAi: true`** — Messages are handled locally. Send goes to `POST /api/ai/chat` (REST), response is added directly to state. Socket is **not** used.
- **`isAi: false`** — Messages are sent via `socket.emit("send_message")`. Typing events are emitted. The room is joined on selection.

---

## Running Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # starts on http://localhost:3000
```

Set `NEXT_PUBLIC_SOCKET_URL=http://localhost:5000` in `frontend/.env.local` if the default doesn't work.

---

## Message Store (In-Memory)

Currently messages are stored in a `Map` inside `chatHandler.js`:

```js
const messageStore = new Map();
// messageStore.get("1") → [{ id, chatId, text, senderId, timestamp }, ...]
```

> **Note:** This is reset every time the server restarts. For production, replace with Supabase queries using the `supabase` client already configured in `backend/src/utils/supabase.js`.
