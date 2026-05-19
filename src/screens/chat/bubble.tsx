import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Bubble, Time } from "react-native-gifted-chat";
import { color, fontFamily, fontSize, getSize } from "../../constants/globalConstants";
import { image } from "../../assets/images";
import { useAppSelector } from "../../store/hooks";

const CustomBubble = (props: any) => {
  const { currentMessage, position, onPreviewImages } = props;
  const { user } = useAppSelector((state) => state.auth);
  const isUser = position === "right";
  const messageImages = [
    ...(Array.isArray(currentMessage?.images) ? currentMessage.images : []),
    ...(!Array.isArray(currentMessage?.images) && currentMessage?.image
      ? [currentMessage.image]
      : []),
  ].filter(Boolean);
  const hasImageMessage = messageImages.length > 0;

  const messageTime = currentMessage?.createdAt
    ? new Date(currentMessage.createdAt).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    : "";

  const renderImageContent = () => {
    if (!hasImageMessage) return null;

    if (messageImages.length === 1) {
      return (
        <TouchableOpacity
          activeOpacity={0.95}
          style={styles.singleImageWrapper}
          onPress={() => onPreviewImages?.(messageImages, 0)}
        >
          <Image
            source={{ uri: messageImages[0] }}
            style={styles.singleImage}
            resizeMode="contain"
          />
          <Text style={styles.imageTime}>{messageTime}</Text>
          {currentMessage.uploading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator color={color.white} size="small" />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    const visibleImages = messageImages.slice(0, 4);
    const remainingCount = messageImages.length - visibleImages.length;

    return (
      <View style={styles.multiImageWrapper}>
        <View style={styles.imageGrid}>
          {visibleImages.map((uri, index) => {
            const showOverlay =
              index === visibleImages.length - 1 && remainingCount > 0;

            return (
              <TouchableOpacity
                key={`${uri}-${index}`}
                activeOpacity={0.95}
                style={styles.gridTile}
                onPress={() => onPreviewImages?.(messageImages, index)}
              >
                <Image
                  source={{ uri }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
                {showOverlay && (
                  <View style={styles.gridOverlay}>
                    <Text
                      style={styles.gridOverlayText}
                    >{`+${remainingCount}`}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.imageTime}>{messageTime}</Text>
        {currentMessage.uploading && (
          <View style={[styles.loaderOverlay, { borderRadius: 10 }]}>
            <ActivityIndicator color={color.white} size="large" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-end",
          marginVertical: 2,
        },
        isUser
          ? { justifyContent: "flex-end" }
          : { justifyContent: "flex-start" },
      ]}
    >
      {!isUser && (
        <View style={{ marginRight: 8, marginBottom: 4 }}>
          <Image
            source={image.legacyOrbLogo}
            style={{ width: getSize(50, 30), height: getSize(50, 30), borderRadius: 100, resizeMode: 'contain' }}
          />
        </View>
      )}

      {hasImageMessage ? (
        <View
          style={[
            styles.imageBubble,
            isUser ? styles.userMessage : styles.botMessage,
          ]}
        >
          {renderImageContent()}
          {currentMessage?.text ? (
            <Text style={styles.imageCaption}>{currentMessage.text}</Text>
          ) : null}
        </View>
      ) : (
        <Bubble
          {...props}
          containerStyle={{
            left: styles.messageContainer,
            right: styles.messageContainer,
          }}
          wrapperStyle={{
            left: styles.botMessage,
            right: styles.userMessage,
          }}
          textStyle={{
            left: styles.messageText,
            right: styles.messageText,
          }}
          timeTextStyle={{
            left: styles.timeText,
            right: styles.timeText,
          }}
          renderTime={(timeProps: any) =>
            timeProps?.currentMessage?.audio ? null : <Time {...timeProps} />
          }
        />
      )}

      {isUser && (
        <View style={{ marginLeft: 8, marginBottom: 4 }}>
          <Image
            source={user?.profilePictureUrl ? { uri: user.profilePictureUrl } : image.dummyUser}
            style={{ width: getSize(50, 30), height: getSize(50, 30), borderRadius: 100 }}
          />
        </View>
      )}
    </View>
  );
};

export default CustomBubble;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "100%",
    minWidth: 110,
  },
  botMessage: {
    backgroundColor: color.LightGray,
    borderRadius: getSize(16, 8),
    padding: getSize(10, 5),
    // width: "100%",
    maxWidth: "100%",
  },
  userMessage: {
    backgroundColor: color.WarmGrayTransparent,
    borderRadius: getSize(16, 8),
    padding: getSize(10, 5),
    // width: "100%",
    maxWidth: "100%",
  },
  messageText: {
    fontSize: getSize(22, 14),
    color: "#000",
    lineHeight: getSize(32, 20),
    fontFamily: fontFamily.RRegular,
    paddingBottom: 0,
  },

  timeText: {
    color: color.black,
    fontSize: fontSize.size10,
    lineHeight: 22,
    fontFamily: fontFamily.RRegular,
  },
  imageBubble: {
    overflow: "hidden",
    maxWidth: 286,
    padding: getSize(8, 4),
  },
  singleImageWrapper: {
    width: "100%",
    // height: "100%",
    borderRadius: getSize(15, 10),
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  singleImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  multiImageWrapper: {
    width: 208,
    position: "relative",
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 220,
    justifyContent: "center",
    alignSelf: "center",
    rowGap: 4,
  },
  gridTile: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginHorizontal: 2,
    // marginBottom: 4,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    justifyContent: "center",
    alignItems: "center",
  },
  gridOverlayText: {
    color: color.white,
    fontSize: 26,
    fontWeight: "700",
  },
  imageTime: {
    position: "absolute",
    right: 5,
    bottom: 5,
    color: color.white,
    fontSize: fontSize.size10,
    fontFamily: fontFamily.RMedium,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageCaption: {
    fontSize: fontSize.size13,
    color: "#000",
    lineHeight: 20,
    fontFamily: fontFamily.RRegular,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
