import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import Typography from "../../components/shared/typography";
import CommonInput from "../../components/shared/input";
import Header from "../../components/header";
import { image } from "../../assets/images";
import { color, fontFamily, getSize } from "../../constants/globalConstants";
import CommonButton from "../../components/shared/button";
import { ClientInstance } from "../../services/apiClient";
import { toggleLoader } from "../../constants/Globals";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AuthUser, setUser } from "../../store/slices/authSlice";
import logger from "../../utils/logger";

const EditScreen = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageObject, setProfileImageObject] = useState<any>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState({
    general: "",
  });

  // ✅ Detect changes properly
  const isChanged = useMemo(() => {
    if (!currentUser) return false;

    return (
      firstName !== (currentUser.firstName || "") ||
      middleName !== (currentUser.middleName || "") ||
      lastName !== (currentUser.lastName || "") ||
      profileImageObject !== null
    );
  }, [firstName, middleName, lastName, profileImageObject, currentUser]);

  const applyUserProfile = useCallback((user: AuthUser) => {
    setFirstName(user.firstName || "");
    setMiddleName(user.middleName || "");
    setLastName(user.lastName || "");
    setProfileImage(user.profilePictureUrl || "");
    setProfileImageObject(null); // reset change state
  }, []);

  useEffect(() => {
    if (currentUser) {
      applyUserProfile(currentUser);
    }
  }, [currentUser, applyUserProfile]);

  const fetchUserProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    toggleLoader(true);

    try {
      const response = await ClientInstance.get(`/auth/me`);
      const fetchedUser =
        response.data?.data || response.data?.user || response.data;

      if (!fetchedUser || typeof fetchedUser !== "object") {
        throw new Error("Invalid user response");
      }

      dispatch(setUser(fetchedUser as AuthUser));
      applyUserProfile(fetchedUser as AuthUser);
    } catch (error: any) {
      logger.error("Fetch profile error:", error);

      setErrors((prev) => ({
        ...prev,
        general:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load user profile.",
      }));

      setTimeout(() => {
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 3000);
    } finally {
      setIsLoadingProfile(false);
      toggleLoader(false);
    }
  }, [dispatch, applyUserProfile]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const profileImageSource = useMemo(() => {
    if (profileImage) {
      return { uri: profileImage };
    }
    return image.dummyUser;
  }, [profileImage]);

  // ✅ FIXED: No auto-save here
  const pickImage = useCallback(() => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: "photo",
      compressImageQuality: 0.6,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
    })
      .then((image) => {
        // Use path consistently across platforms as sourceURL can be missing
        const uri = image.path;

        setProfileImage(uri);
        setProfileImageObject(image);

        setErrors((prev) => ({ ...prev, general: "" }));
      })
      .catch((error) => {
        if (error.code !== "E_PICKER_CANCELLED") {
          logger.error("Image picker error:", error);
          setErrors((prev) => ({
            ...prev,
            general: "Failed to pick image. Please try again.",
          }));
        }
      });
  }, []);

  const handleSave = async () => {
    setErrors({ general: "" });

    if (!firstName.trim()) {
      setErrors((prev) => ({
        ...prev,
        general: "First name is required",
      }));
      return;
    }

    setIsSaving(true);
    toggleLoader(true);

    try {
      const formData = new FormData();

      if (profileImageObject) {
        const uri = profileImageObject.path.startsWith("file://")
          ? profileImageObject.path
          : `file://${profileImageObject.path}`;

        formData.append("profilePicture", {
          uri: uri,
          type: profileImageObject.mime || "image/jpeg",
          name:
            profileImageObject.filename ||
            `profile-${Date.now()}.jpg`,
        } as any);
      }

      formData.append("firstName", firstName.trim());
      formData.append("middleName", (middleName || "").trim());
      formData.append("lastName", (lastName || "").trim());

      const response = await ClientInstance.patch(
        `/users/profile`,
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        dispatch(setUser(response.data as AuthUser));
        fetchUserProfile();

        setErrors((prev) => ({
          ...prev,
          general: "Profile updated successfully!",
        }));

        setTimeout(() => {
          setErrors((prev) => ({ ...prev, general: "" }));
        }, 3000);
      }
    } catch (error: any) {
      logger.error("Update profile error:", error);

      setErrors({
        general:
          error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          "Network Error: Unable to reach the server",
      });
    } finally {
      setIsSaving(false);
      toggleLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" isBack />

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <View style={styles.imageWrapper}>
              <Image source={profileImageSource} style={styles.profileImage} />

              <TouchableOpacity
                style={styles.editIcon}
                onPress={pickImage}
              >
                <Image
                  source={image.edit}
                  style={styles.editButtonIcon}
                />
              </TouchableOpacity>
            </View>

            <Typography
              text="Edit Profile"
              size={getSize(24, 16)}
              style={styles.ProfileTitle}
            />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View>
              <Typography size={getSize(22, 16)} text="First Name" style={styles.label} />
              <CommonInput
                value={firstName}
                placeholder="Enter first name"
                onChangeHandler={(val) => {
                  setFirstName(val);
                  setErrors((prev) => ({ ...prev, general: "" }));
                }}
              />
            </View>

            <View>
              <Typography size={getSize(22, 16)} text="Middle Name" style={styles.label} />
              <CommonInput
                value={middleName}
                placeholder="Enter middle name"
                onChangeHandler={(val) => {
                  setMiddleName(val);
                  setErrors((prev) => ({ ...prev, general: "" }));
                }}
              />
            </View>

            <View>
              <Typography size={getSize(22, 16)} text="Last Name" style={styles.label} />
              <CommonInput
                value={lastName}
                placeholder="Enter last name"
                onChangeHandler={(val) => {
                  setLastName(val);
                  setErrors((prev) => ({ ...prev, general: "" }));
                }}
              />
            </View>

            <Typography
              text={errors.general || ""}
              size={getSize(20, 14)}
              color={color.black}
              family={fontFamily.RMedium}
            />
          </View>

          {/* Save Button */}
          <CommonButton
            title={isLoadingProfile || isSaving ? "Saving..." : "Save"}
            containerStyle={styles.saveButton}
            onPress={handleSave}
            disabled={isLoadingProfile || isSaving || !isChanged}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 28,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: getSize(150, 82),
    height: getSize(150, 82),
    borderRadius: 150,
    borderWidth: 1,
  },
  ProfileTitle: {
    marginVertical: 10,
    fontWeight: "600",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    width: getSize(42, 24),
    height: getSize(42, 24),
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonIcon: {
    width: getSize(22, 15),
    height: getSize(22, 15),
    resizeMode: "contain",
  },
  form: {
    gap: getSize(20, 10),
  },
  label: {
    marginBottom: getSize(8, 4),
  },
  saveButton: {
    marginTop: 36,
  },
});
