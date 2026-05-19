import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Actions,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import Header from "../../components/header";
import { image } from "../../assets/images";
import { color, fontFamily, getSize } from "../../constants/globalConstants";
import ImageCropPicker from "react-native-image-crop-picker";
import RecordingBar from "./recorder";
import AudioMessage from "./audio-message";
import { useAppSelector } from "../../store/hooks";
import CustomBubble from "./bubble";
import Typography from "../../components/shared/typography";
import { uploadImage } from "../../services/chatUpload";
import { useChat } from "../../hooks/useChat";
import { MessageType, FormattedChatMessage } from "../../types/chat";
import { normalizeLocalFileUri } from "../../utils/chatUtils";
import logger from "../../utils/logger";
import LottieView from "lottie-react-native";
import { ImagePreview } from "./image-preview";
import { MediaComposer } from "./media-composer";

const ActionIcon = ({ isAgentTyping }: { isAgentTyping: boolean }) => (
  <View
    style={[
      styles.actionIconContainer,
      { opacity: isAgentTyping ? 0.4 : 1 },
    ]}
  >
    <Image source={image.paperPin} style={styles.actionIcon} />
  </View>
);

const SendIcon = ({ isAgentTyping, isMicrophone }: { isAgentTyping: boolean; isMicrophone?: boolean }) => (
  <View style={[styles.sendButton, { opacity: isAgentTyping ? 0.4 : 1 }]}>
    <Image
      source={isMicrophone ? image.microphone : image.send}
      style={isMicrophone ? styles.microphoneIcon : styles.sendIcon}
    />
  </View>
);

const ChatThinkingFooter = ({ isAgentTyping }: { isAgentTyping: boolean }) => {
  if (!isAgentTyping) return null;

  return (
    <View style={styles.footerContainer}>
      <View style={styles.typingIndicatorContainer}>
        <LottieView
          source={require("../../assets/gif/typing.json")}
          style={styles.typingLottie}
          autoPlay
          loop
        />
        <Typography
          text={"Thinking"}
          color={color.MediumGray}
          size={getSize(22, 14)}
          family={fontFamily.RRegular}
          style={styles.thinkingText}
        />
      </View>
    </View>
  );
};

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

export default function ChatScreen() {
  const { token, user } = useAppSelector((state) => state.auth);

  const {
    messages,
    setMessages,
    conversationId,
    conversationStatus,
    isAgentTyping,
    agentStatus,
    sendTextMessage,
    sendMediaMessage,
  } = useChat({
    token,
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [selectedImageUris, setSelectedImageUris] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const [mediaCaption, setMediaCaption] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const shouldShowEndedLabel =
    conversationStatus === "ABANDONED" || conversationStatus === "COMPLETED";

  const pickFromGallery = useCallback(async () => {
    try {
      const pickedImages = await ImageCropPicker.openPicker({
        multiple: true,
        mediaType: "photo",
        compressImageQuality: 0.6,
        compressImageMaxWidth: 800,
        compressImageMaxHeight: 800,
      });
      const images = Array.isArray(pickedImages) ? pickedImages : [pickedImages];

      if (!images.length) return;

      const localImageUris = images
        .map((item) => normalizeLocalFileUri(item?.path))
        .filter(Boolean) as string[];

      if (!localImageUris.length) return;

      setSelectedImages(images);
      setSelectedImageUris(localImageUris);
      setSelectedImageIndex(0);
      setMediaCaption("");
      setIsComposerVisible(true);
    } catch (error) {
      logger.log("Image picker error:", error);
    }
  }, []);

  const closeMediaComposer = useCallback(() => {
    if (isUploadingMedia) return;

    setIsComposerVisible(false);
    setSelectedImages([]);
    setSelectedImageUris([]);
    setSelectedImageIndex(0);
    setMediaCaption("");
  }, [isUploadingMedia]);

  const sendSelectedImages = useCallback(async () => {
    if (!selectedImages.length || isUploadingMedia) return;

    try {
      setIsUploadingMedia(true);

      const messageId = Date.now();
      const caption = mediaCaption.trim();
      const localImageUris = selectedImageUris;

      const newMessage: any = {
        _id: messageId,
        createdAt: new Date().toISOString(),
        user: {
          _id: 1,
          name: "User",
        },
        text: caption,
        image: localImageUris[0],
        images: localImageUris,
        uploading: true,
      };

      setMessages(GiftedChat.append(messages, [newMessage]) as FormattedChatMessage[]);

      setIsComposerVisible(false);
      setSelectedImages([]);
      setSelectedImageUris([]);
      setSelectedImageIndex(0);
      setMediaCaption("");

      const uploadedResults = await uploadImage(false, selectedImages);
      const uploadedImageUrls = Array.isArray(uploadedResults)
        ? uploadedResults
        : uploadedResults?.imageUrls || [];

      const finalMessages = GiftedChat.append(messages, [newMessage]).map((message: any) =>
        message._id === messageId
          ? {
              ...message,
              image: uploadedImageUrls.length ? uploadedImageUrls[0] : message.image,
              images: uploadedImageUrls.length ? uploadedImageUrls : message.images,
              uploading: false,
            }
          : message,
      );

      setMessages(finalMessages as FormattedChatMessage[]);

      if (!conversationId || !uploadedImageUrls.length) return;

      sendMediaMessage({
        messageId,
        type: MessageType.IMAGE,
        imageUrls: uploadedImageUrls,
        text: caption,
      });
    } catch (error) {
      logger.log("Image upload error:", error);
    } finally {
      setIsUploadingMedia(false);
    }
  }, [
    conversationId,
    isUploadingMedia,
    mediaCaption,
    messages,
    selectedImageUris,
    selectedImages,
    sendMediaMessage,
    setMessages,
  ]);

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

  const cancelRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  const sendRecording = useCallback(
    async ({
      audioPath,
      waveformFrames,
    }: {
      audioPath: string;
      waveformFrames: number[];
    }) => {
      try {
        setIsRecording(false);

        const messageId = Date.now();
        const newMessage: any = {
          _id: messageId,
          createdAt: new Date().toISOString(),
          user: { _id: 1 },
          audio: audioPath,
          pitchFrames: waveformFrames,
        };

        setMessages(GiftedChat.append(messages, [newMessage]) as FormattedChatMessage[]);

        const uploadResult: any = await uploadImage(true, audioPath);

        const uploadedWaveform =
          uploadResult?.pitchFrames ||
          uploadResult?.waveform ||
          uploadResult?.audioMetadata?.pitchFrames ||
          uploadResult?.audioMetadata?.waveform ||
          waveformFrames;

        const finalMessages = GiftedChat.append(messages, [newMessage]).map((message: any) =>
          message._id === messageId
            ? {
                ...message,
                audio: uploadResult?.audioUrl,
                pitchFrames: uploadedWaveform,
              }
            : message,
        );

        setMessages(finalMessages as FormattedChatMessage[]);

        if (!conversationId) return;

        sendMediaMessage({
          messageId,
          type: MessageType.VOICE,
          url: uploadResult?.audioUrl,
          pitchFrames: uploadedWaveform,
        });
      } catch (error) {
        logger.log(error);
        setIsRecording(false);
      }
    },
    [conversationId, messages, sendMediaMessage, setMessages],
  );

  const renderInputToolbar = useCallback(
    (props: any) => {
      if (shouldShowEndedLabel) return null;

      if (isRecording) {
        return <RecordingBar onCancel={cancelRecording} onSend={sendRecording} />;
      }
      return (
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbar}
          primaryStyle={styles.inputToolbarPrimary}
        />
      );
    },
    [cancelRecording, isRecording, sendRecording, shouldShowEndedLabel],
  );

  const renderActions = useCallback(
    (props: any) => (
      <Actions
        {...props}
        containerStyle={styles.actionsContainer}
        icon={() => <ActionIcon isAgentTyping={isAgentTyping} />}
        onPressActionButton={pickFromGallery}
      />
    ),
    [isAgentTyping, pickFromGallery],
  );

  const renderComposer = useCallback(
    (props: any) => (
      <Composer
        {...props}
        placeholder="Type or record your message"
        placeholderTextColor={color.DimGray}
        textInputStyle={styles.composerStyle}
        textInputProps={{
          ...props.textInputProps,
          style: styles.input,
          placeholderTextColor: color.DimGray,
          underlineColorAndroid: "transparent",
          keyboardAppearance: "light",
          multiline: true,
          scrollEnabled: true,
          textAlignVertical: "top",
        }}
        cursorColor={color.DarkSlateGray}
        editable={!isAgentTyping}
      />
    ),
    [isAgentTyping],
  );

  const renderSend = useCallback(
    (props: any) => {
      const hasText = props.text && props.text.trim().length > 0;

      if (hasText && !isAgentTyping) {
        return (
          <Send {...props} containerStyle={styles.sendContainer}>
            <SendIcon isAgentTyping={isAgentTyping} />
          </Send>
        );
      }

      return (
        <View style={styles.sendContainer}>
          <TouchableOpacity
            onPress={() => setIsRecording(true)}
            disabled={isAgentTyping}
          >
            <SendIcon isAgentTyping={isAgentTyping} isMicrophone />
          </TouchableOpacity>
        </View>
      );
    },
    [isAgentTyping],
  );

  const renderFooter = useCallback(() => {
    return (
      <ChatThinkingFooter isAgentTyping={isAgentTyping || (!!agentStatus && !!agentStatus.message)} />
    );
  }, [agentStatus, isAgentTyping]);

  const renderChatFooter = useCallback(() => {
    return <ChatEndedFooter shouldShowEndedLabel={shouldShowEndedLabel} />;
  }, [shouldShowEndedLabel]);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        { opacity: fadeAnim },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={"padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 30}
      >
        <Header title="Chat" isMenu />
        <GiftedChat
          messages={messages}
          onSend={(messages) => sendTextMessage(messages)}
          user={{
            _id: 1,
            name: "User",
            avatar: user?.profilePictureUrl ? user?.profilePictureUrl : image.dummyUser,
          }}
          {...({ alwaysShowSend: true } as any)}
          minComposerHeight={44}
          maxComposerHeight={70}
          renderAvatarOnTop
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderActions={renderActions}
          renderComposer={renderComposer}
          renderSend={renderSend}
          isKeyboardInternallyHandled={false}
          renderMessageAudio={(props) => <AudioMessage {...props} />}
          messagesContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
          showAvatarForEveryMessage={false}
          renderAvatar={null}
          renderFooter={renderFooter}
          renderChatFooter={renderChatFooter}
        />
        <ImagePreview
          isVisible={isPreviewVisible}
          images={previewImages}
          index={previewIndex}
          onClose={closeImagePreview}
          onIndexChange={setPreviewIndex}
        />
        <MediaComposer
          isVisible={isComposerVisible}
          imageUris={selectedImageUris}
          index={selectedImageIndex}
          caption={mediaCaption}
          isUploading={isUploadingMedia}
          onClose={closeMediaComposer}
          onSend={sendSelectedImages}
          onIndexChange={setSelectedImageIndex}
          onCaptionChange={setMediaCaption}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: color.white,
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 0,
  },
  inputToolbar: {
    borderTopWidth: 0.5,
    borderColor: color.BorderLight,
    backgroundColor: color.white,
    paddingHorizontal: getSize(20, 16),
    paddingVertical: getSize(16, 12),
  },
  inputToolbarPrimary: {
    alignItems: "center",
    backgroundColor: color.LightSkyBlueTransparent,
    borderRadius: 50,
    paddingHorizontal: getSize(10, 5),
    paddingVertical: Platform.OS === "ios" ? getSize(8, 4) : getSize(4, 2),
    borderWidth: 1,
    borderColor: color.LightGray,
  },
  actionsContainer: {
    width: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  actionIconContainer: {
    width: getSize(32, 24),
    height: getSize(32, 24),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    width: getSize(20, 12),
    height: getSize(30, 24),
    resizeMode: "contain",
  },
  composerStyle: {
    maxHeight: 70,
  },
  input: {
    fontSize: getSize(22, 16),
    color: color.black,
    paddingHorizontal: getSize(16, 8),
    paddingTop: getSize(16, 8),
    paddingBottom: getSize(16, 8),
    textAlignVertical: "top",
    maxHeight: 80,
  },
  sendContainer: {
    height: getSize(55, 40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  sendButton: {
    width: getSize(50, 38),
    height: getSize(50, 38),
    borderRadius: 50,
    backgroundColor: color.black,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: getSize(24, 18),
    height: getSize(24, 18),
    resizeMode: "contain",
  },
  microphoneIcon: {
    width: getSize(26, 20),
    height: getSize(26, 20),
    borderRadius: 50,
    resizeMode: "contain",
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  typingIndicatorContainer: {
    backgroundColor: color.LightGray,
    paddingVertical: getSize(8, 4),
    paddingHorizontal: getSize(20, 12),
    borderRadius: 20,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
    flexDirection: "row",
    position: "relative",
    width: getSize("16%", "27%"),
  },
  typingLottie: {
    width: getSize(60, 40),
    height: getSize(50, 30),
    position: "absolute",
    left: 0,
  },
  thinkingText: {
    textAlign: "left",
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
