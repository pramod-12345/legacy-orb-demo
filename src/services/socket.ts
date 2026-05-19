import Config from "react-native-config";
import { io, Socket } from "socket.io-client";
import logger from "../utils/logger";

const SOCKET_URL = Config.BASE_URL;

let socket: Socket | null = null;
let currentToken: string | null = null;

interface StartConversationPayload {
  conversationId?: string;
}

interface SendMessagePayload {
  conversationId: string | undefined;
  text?: string;
  messageType?: string;
  audioUrl?: string;
  imageUrls?: string | string[];
}

export const connectSocket = (token: string | null) => {
  if (socket && currentToken === token && socket.active) {
    logger.log("Socket already active with same token.");
    return socket;
  }

  if (socket) {
    logger.log("Disconnecting existing socket before re-connecting...");
    socket.disconnect();
  }

  currentToken = token;
  const newSocket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
  });

  socket = newSocket;

  newSocket.on("connect", () => {
    logger.log("✅ Socket Connected:", newSocket.id);
  });

  newSocket.on("disconnect", (reason) => {
    logger.log("❌ Socket Disconnected:", reason);
  });

  newSocket.on("connect_error", (err) => {
    logger.log("Socket Connection Error:", err.message);
  });

  return newSocket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};

/**
 * Start or Resume Conversation
 */
export const startConversation = (payload: StartConversationPayload) => {
  if (!socket) return;
  logger.log('payload Start chat>>', payload);

  socket.emit("start_conversation", payload);
};

/**
 * Send Message
 */
export const sendMessage = (payload: SendMessagePayload) => {
  logger.log('send_message payload:', payload);
  if (!socket) return;

  socket.emit("send_message", payload);
};

/**
 * Listen for Conversation Started
 */
export const onConversationStarted = (callback: (data: any) => void) => {
  if (!socket) return;

  socket.on("conversation_started", callback);
};

/**
 * Listen for Incoming Messages
 */
export const onMessage = (callback: (data: any) => void) => {
  if (!socket) return;

  socket.on("onMessage", callback);
};

/**
 * Listen for typing status
 */
export const onAgentStatus = (callback: (data: any) => void) => {
  if (!socket) return;

  socket.on("agent_status", callback);
};

/**
 * Listen for session status
 */
export const onSessionStatus = (callback: (data: any) => void) => {
  if (!socket) return;

  socket.on("session_status", callback);
};
/**
 * Listen for Errors
 */
export const onError = (callback: (error: any) => void) => {
  if (!socket) return;

  socket.on("error", callback);
};
