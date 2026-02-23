import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

/**
 * Returns the shared Socket.IO client instance.
 * Creates it on the first call (lazy singleton).
 * @param userId  - the current user's ID (passed as a handshake query param)
 * @param userDisplayName - the current user's display name
 */
export const getSocket = (userId?: string, userDisplayName?: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      query: {
        userId: userId ?? "anonymous",
        userName: userDisplayName ?? "User",
      },
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

/**
 * Disconnects and destroys the singleton (call on logout / unmount at root).
 */
export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
};
