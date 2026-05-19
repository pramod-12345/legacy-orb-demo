import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { color, fontFamily, getSize } from "../../constants/globalConstants";
import { image } from "../../assets/images";

interface CommonInputProps {
  onChangeHandler: (text: string) => void;
  value: string;
  placeholder: string;
  isIconVisible?: boolean;
  mainContainerStyle?: object;
  inputStyle?: object;
  icon?: any;
  height?: number;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: any;
  onPress?: any;
  keyboardType?: any;
  maxLength?: number;
  onFocus?: any;
  isPassword?: boolean;
  autoCorrect?: boolean;
  readOnly?: boolean;
  returnKeyType?: string;
  ref?: any;
}

const CommonInput: React.FC<CommonInputProps> = ({
  onChangeHandler,
  ref,
  value,
  placeholder,
  mainContainerStyle,
  inputStyle,
  height,
  multiline,
  numberOfLines,
  textAlignVertical,
  onPress,
  keyboardType,
  maxLength,
  onFocus,
  isPassword,
  autoCorrect,
  readOnly,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View
      style={[
        styles.inputContainer,
        mainContainerStyle,
        height ? { height: height } : {},
        isPassword ? styles.paddingPassword : styles.paddingNormal,
      ]}
    >
      <TextInput
        ref={ref}
        autoCorrect={autoCorrect}
        autoCapitalize="none"
        style={[
          styles.input,
          inputStyle,
          styles.textInput,
          isPassword ? styles.maxWidthPassword : styles.maxWidthNormal,
        ]}
        onChangeText={onChangeHandler}
        multiline={multiline}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={color.CoolGray}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        onPressIn={onPress}
        maxLength={maxLength}
        keyboardType={keyboardType}
        onFocus={onFocus}
        readOnly={readOnly}
        secureTextEntry={isPassword ? !showPassword : false}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIconContainer}
        >
          <Image
            source={showPassword ? image.eye : image.eyeOff}
            style={styles.eyeIcon}
            tintColor={"#808080"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommonInput;

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    paddingLeft: getSize(22, 16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    height: getSize(80, 54), // Changed from fixed height to minHeight
    backgroundColor: color.LightSkyBlueTransparent,
  },
  paddingPassword: {
    paddingRight: 0,
  },
  paddingNormal: {
    paddingRight: 16,
  },
  input: {
    paddingVertical: getSize(20, 12), // Let padding handle the vertical space
    paddingHorizontal: 0,
    flex: 1, // Take up all available horizontal space
    fontFamily: fontFamily.RRegular,
    color: color.black,
    textAlignVertical: 'center', // Added for Android centering
  },
  textInput: {
    fontSize: getSize(24, 16),
  },
  maxWidthPassword: {
    maxWidth: "85%",
  },
  maxWidthNormal: {
    maxWidth: "auto",
  },
  eyeIconContainer: {
    paddingHorizontal: 16, // Better tap target
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: getSize(36, 24),
    height: getSize(36, 24)
  },
});