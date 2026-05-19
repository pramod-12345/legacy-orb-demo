import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Typography from "./typography";
import { fontFamily, isTablet } from "../../constants/globalConstants";

interface CommonButtonProps {
  title: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  textColor?: string;
  disabled?: boolean;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onPress,
  containerStyle,
  textColor = "#fff",
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton, containerStyle]}
      onPress={onPress}
    >
      <Typography
        text={title}
        size={isTablet ? 24 : 16}
        color={textColor}
        family={fontFamily.RSBold}
      />
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    paddingVertical: isTablet ? 28 : 18,
    borderRadius: 100, // Make it pill-shaped
    alignItems: "center",
    justifyContent: 'center',
    minHeight: isTablet ? 72 : 56, // Better touch target
  },
  disabledButton: {
    opacity: 0.5,
  },
});