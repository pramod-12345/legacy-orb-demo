import { image } from "../assets/images";
import {
  FormattedChatMessage,
  RawChatMessage,
  SenderType,
  MessageType,
} from "../types/chat";

export const normalizeLocalFileUri = (uri?: string): string => {
  if (!uri) {
    return "";
  }

  if (
    uri.startsWith("file://") ||
    uri.startsWith("content://") ||
    uri.startsWith("ph://") ||
    uri.startsWith("assets-library://") ||
    uri.startsWith("http://") ||
    uri.startsWith("https://")
  ) {
    return uri;
  }

  return `file://${uri}`;
};

export const formatMessage = (msg: RawChatMessage, profilePictureUrl: string | undefined = image.dummyUser): FormattedChatMessage => {

  const imageUrls = Array.isArray(msg?.imageUrls)
    ? msg.imageUrls.filter(Boolean)
    : msg?.imageUrls
      ? [msg.imageUrls as string]
      : [];

  const formattedMessage: FormattedChatMessage = {
    _id: msg.id ? msg.id : `${Date.now()}-${Math.random()}`,
    text: msg.content || "",
    createdAt: (msg.createdAt ? new Date(msg.createdAt) : new Date()).toISOString(),
    user: {
      _id: msg.senderType === SenderType.USER ? 1 : 2,
      name:
        msg.senderType === SenderType.USER
          ? msg.sender?.firstName || "User"
          : "Legacy Orb",
      avatar:
        msg.senderType === SenderType.USER
          ? profilePictureUrl
          : image.legacyOrbLogo,
    },
  };

  if (msg.messageType === MessageType.IMAGE && imageUrls.length) {
    formattedMessage.image = imageUrls[0];
    formattedMessage.images = imageUrls;
  }

  if (msg.messageType === MessageType.VOICE && msg.audioUrl) {
    formattedMessage.audio = msg.audioUrl;
    formattedMessage.pitchFrames =
      msg.pitchFrames ||
      msg.waveform ||
      msg.audioMetadata?.pitchFrames ||
      msg.audioMetadata?.waveform ||
      msg.meta?.pitchFrames ||
      msg.meta?.waveform ||
      [];
  }

  return formattedMessage;
};
