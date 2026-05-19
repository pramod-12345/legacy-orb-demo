import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  GiftedChat,
} from "react-native-gifted-chat";
import Header from "../../components/header";
import { color, fontFamily } from "../../constants/globalConstants";
import AudioMessage from "../chat/audio-message";
import { useAppSelector } from "../../store/hooks";
import CustomBubble from "../chat/bubble";
import Typography from "../../components/shared/typography";
import { toggleLoader } from "../../constants/Globals";
import { FormattedChatMessage, RawChatMessage } from "../../types/chat";
import { formatMessage } from "../../utils/chatUtils";
import logger from "../../utils/logger";
import { ClientInstance } from "../../services/apiClient";
import { ImagePreview } from "../chat/image-preview";

const ChatEndedFooter = ({ shouldShowEndedLabel }: { shouldShowEndedLabel: boolean }) => {
  if (!shouldShowEndedLabel) return null;

  return (
    <View style={styles.chatEndedWrapper}>
      <View style={styles.chatEndedLine} />
      <View style={styles.chatEndedLabel}>
        <Typography
          text="This chat has ended"
          size={14}
          family={fontFamily.RMedium}
          color={color.MediumGray}
          style={styles.chatEndedText}
        />
      </View>
      <View style={styles.chatEndedLine} />
    </View>
  );
};

export default function ChatPreviewScreen() {
  const route = useRoute<any>();
  const routeConversationId = route.params?.conversationId ?? null;
  const routeConversationStatus = route.params?.status ?? null;

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [messages, setMessages] = useState<FormattedChatMessage[]>([]);
  const { user } = useAppSelector((state) => state.auth);

  const shouldShowEndedLabel =
    routeConversationStatus === "ABANDONED" || routeConversationStatus === "COMPLETED";

  const openImagePreview = useCallback((images: string[] = [], index = 0) => {
    if (!images.length) return;

    setPreviewImages(images);
    setPreviewIndex(index);
    setIsPreviewVisible(true);
  }, []);

  const closeImagePreview = useCallback(() => {
    setIsPreviewVisible(false);
    setPreviewImages([]);
    setPreviewIndex(0);
  }, []);

  const renderBubble = useCallback(
    (props: any) => {
      return <CustomBubble {...props} onPreviewImages={openImagePreview} />;
    },
    [openImagePreview],
  );

  const renderChatFooter = useCallback(() => {
    return <ChatEndedFooter shouldShowEndedLabel={shouldShowEndedLabel} />;
  }, [shouldShowEndedLabel]);

  const fetchOldMessages = useCallback(
    async (cid: string, showLoader: boolean) => {
      if (showLoader) toggleLoader(true);
      try {
        const res = await ClientInstance.get(`/chat/${cid}`);
        const formatted = res.data.map((msg: RawChatMessage) =>
          formatMessage(msg, user?.profilePictureUrl),
        );
        setMessages(formatted.reverse());
      } catch (error) {
        logger.log("Fetch old chat error:", error);
      } finally {
        if (showLoader) toggleLoader(false);
      }
    },
    [user?.profilePictureUrl],
  );

  useEffect(() => {
    if (routeConversationId) {
      fetchOldMessages(routeConversationId, true);
    }
  }, [routeConversationId, fetchOldMessages]);

  return (
    <View style={styles.container}>
      <Header isBack />
      <GiftedChat
        messages={messages}
        onSend={() => { }}
        user={{
          _id: 1,
          name: "User",
        }}
        renderInputToolbar={() => null}
        renderBubble={renderBubble}
        renderMessageAudio={(props) => <AudioMessage {...props} />}
        messagesContainerStyle={styles.messagesContainer}
        showAvatarForEveryMessage={false}
        renderAvatar={null}
        renderChatFooter={renderChatFooter}
      />
      <ImagePreview
          isVisible={isPreviewVisible}
          images={previewImages}
          index={previewIndex}
          onClose={closeImagePreview}
          onIndexChange={setPreviewIndex}
        />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 0,
  },
  chatEndedWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatEndedLine: {
    height: 1,
    width: "30%",
    backgroundColor: "gray",
  },
  chatEndedLabel: {
    backgroundColor: "transparent",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 50,
  },
  chatEndedText: {
    textAlign: "center",
  },
});
