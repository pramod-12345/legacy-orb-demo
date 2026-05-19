import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import CommonButton from "../../components/shared/button";
import Typography from "../../components/shared/typography";
import CommonInput from "../../components/shared/input";
import { image } from "../../assets/images";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { color, fontFamily, fontSize, getSize } from "../../constants/globalConstants";
import logger from "../../utils/logger";
import { ClientInstance } from "../../services/apiClient";
import { toggleLoader } from "../../constants/Globals";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    general: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      general: "",
    };

    // validate both
    if (!email.trim() && !password) {
      newErrors.general = "Email and Password are required";
      isValid = false;
      setErrors(newErrors);
      return isValid;
    }
    // Email validation
    if (!email.trim()) {
      newErrors.general = "Email is required";
      isValid = false;
      setErrors(newErrors);
      return isValid;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.general = "Please enter a valid email address";
      isValid = false;
      setErrors(newErrors);
      return isValid;
    }

    // Password validation
    if (!password) {
      newErrors.general = "Password is required";
      isValid = false;
      setErrors(newErrors);
      return isValid;
    } else if (password.length < 6) {
      newErrors.general = "Password must be at least 6 characters";
      isValid = false;
      setErrors(newErrors);
      return isValid;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    // Clear previous errors
    setErrors({ general: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    toggleLoader(true);

    try {
      const response = await ClientInstance.post(`/auth/login`, {
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (response.status === 200) {
        // Handle successful login using refactored slice logic
        dispatch(
          setCredentials({
            token: response.data.access_token,
            refreshToken: response.data.refresh_token,
            validTill: response.data.expires_in,
            refreshValidTill: response.data.refresh_expires_in,
            user: response.data.user,
          }),
        );
      }
    } catch (error: any) {
      logger.error("Login error:", error);
      setErrors({
        ...errors,
        general: error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
      });
    } finally {
      toggleLoader(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors({ ...errors, general: "" });
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors({ ...errors, general: "" });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.wrapper}>
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <Image source={image.legacyOrbLogo} style={styles.logo} />
            <Typography text="Legacy Orb" size={getSize(44, 34)} style={styles.title} />
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Capture your life story {"\n"}One moment at a time
          </Text>

          {/* Email Input */}
          <View style={styles.inputEmailContainer}>
            <Typography
              text="Email"
              size={getSize(22, 16)}
              family={fontFamily.RMedium}
              style={styles.label}
            />
            <CommonInput
              value={email}
              placeholder="Enter email"
              onChangeHandler={handleEmailChange}
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View>
            <Typography
              text="Password"
              size={getSize(22, 16)}
              family={fontFamily.RMedium}
              style={styles.label}
            />
            <CommonInput
              value={password}
              placeholder="Enter password"
              onChangeHandler={handlePasswordChange}
              isPassword={true}
            />
          </View>

          <View style={styles.forgotPasswordContainer}>
            {/* General Error Message */}
            {errors.general ? (
              <Typography
                text={errors.general}
                size={14}
                family={fontFamily.RMedium}
                color={color.black}
                style={styles.generalErrorText}
              />
            ) : <View />}

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPasswordButton}
            >
              <Typography
                text="Forgot Password?"
                size={getSize(22, 14)}
                color={color.DarkBlueGray}
                family={fontFamily.RRegular}
                style={styles.forgotPassword}
              />
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <CommonButton title="Sign In" onPress={handleSignIn} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: 25,
    paddingVertical: getSize(48, 28),
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  label: {
    marginBottom: 4,
  },
  logo: {
    width: getSize('50%', '30%'),
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain'
    // height: 70,
  },
  title: {
    fontSize: fontSize.size32,
    fontFamily: fontFamily.RRegular,
    color: color.black,
    textAlign: "center",
    marginTop: 8,
  },
  description: {
    fontFamily: fontFamily.RRegular,
    color: color.DarkBlueGray,
    textAlign: "center",
    marginBottom: 28,
    fontSize: getSize(22, 16),
    lineHeight: getSize(30, 22)
  },
  inputEmailContainer: {
    marginBottom: 16,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  generalErrorContainer: {
    backgroundColor: `${color.black}10`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${color.black}30`,
  },
  generalErrorText: {
    width: '60%',
    paddingVertical: 4,
  },
  forgotPasswordContainer: {
    alignItems: "flex-start",
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 30,
  },
  forgotPasswordButton: {
    paddingVertical: 4,
  },
  forgotPassword: {
    lineHeight: getSize(28, 22)
  },
});

export default LoginScreen;