import { IMessage } from "react-native-gifted-chat";

export enum SenderType {
  USER = "USER",
  AGENT = "AGENT",
  SYSTEM = "SYSTEM",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VOICE = "VOICE",
}

export interface ChatUser {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface RawChatMessage {
  id: string;
  conversationId?: string;
  content?: string;
  createdAt: string;
  senderType: SenderType;
  messageType: MessageType;
  sender?: ChatUser;
  imageUrls?: string | string[];
  audioUrl?: string;
  pitchFrames?: number[];
  waveform?: number[];
  audioMetadata?: {
    pitchFrames?: number[];
    waveform?: number[];
  };
  meta?: {
    pitchFrames?: number[];
    waveform?: number[];
  };
}

export interface FormattedChatMessage extends Omit<IMessage, 'createdAt'> {
  createdAt: string | number | Date;
  images?: string[];
  pitchFrames?: number[];
}

export interface AgentStatus {
  agent?: string;
  status?: string;
  message?: string;
}

export interface SessionStatus {
  conversationId: string;
  status: string;
}

export interface ConversationStarted {
  conversationId: string;
  status?: string;
}

export interface StartConversationPayload {
  conversationId?: string;
}

export interface SendMessagePayload {
  conversationId: string | undefined;
  text?: string;
  messageType?: MessageType;
  audioUrl?: string;
  imageUrls?: string | string[];
}
