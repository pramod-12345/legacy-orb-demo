import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { IMessage } from "react-native-gifted-chat";
import { useIsFocused } from "@react-navigation/native";
import {
  connectSocket,
  startConversation,
  sendMessage,
  onConversationStarted,
  onMessage,
  getSocket,
  onAgentStatus,
  onSessionStatus,
} from "../services/socket";
import { ActivityContext } from "../store/activity-context";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setMessages,
  appendMessages,
  addUniqueMessage,
  setConversationId,
  setConversationStatus,
  resetChat,
} from "../store/slices/chatSlice";
import {
  AgentStatus,
  ConversationStarted,
  FormattedChatMessage,
  MessageType,
  RawChatMessage,
  SessionStatus,
  SenderType,
} from "../types/chat";
import { getChatStatus } from "../services/chatService";
import { formatMessage } from "../utils/chatUtils";
import logger from "../utils/logger";

interface UseChatProps {
  token: string | null;
}

export const useChat = ({ token }: UseChatProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const { messages, conversationId, conversationStatus } = useAppSelector(
    (state) => state.chat,
  );

  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);

  const { isForeground } = useContext(ActivityContext);
  const isFocused = useIsFocused();

  const conversationIdRef = useRef<string | null>(conversationId);
  const isStartingRef = useRef(false);

  return {
    messages,
    setMessages: (msgs: FormattedChatMessage[]) =>
      dispatch(setMessages(msgs)),
    conversationId,
    conversationStatus,
    isAgentTyping,
    agentStatus,
    handleStartNewChat,
    sendTextMessage,
    sendMediaMessage,
  };
};
