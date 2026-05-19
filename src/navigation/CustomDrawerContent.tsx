import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  TouchableOpacity,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { image } from "../assets/images";
import { logout } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  color,
  fontFamily,
  fontSize,
  getHeight,
  getSize,
  getWidth,
} from "../constants/globalConstants";
import Typography from "../components/shared/typography";
import React from "react";
import { resetChat, resetTimeline } from "../store/slices/chatSlice";

const DrawerItem = ({ label, icon, route, onClick, navigation }: any) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (route) {
          navigation.navigate(route);
        } else if (onClick) {
          onClick();
        }
      }}
      style={styles.menuItem}
    >
      <View style={styles.item}>
        <Image
          source={icon}
          style={styles.menuIcon}
          tintColor={color.CharcoalGray}
        />
        <Typography
          text={label}
          size={getSize(26, 16)}
          family={fontFamily.RRegular}
          color={color.black}
        />
      </View>
      <Image source={image.rightArrow} style={styles.rightArrow} />
    </TouchableOpacity>
  );
};

export default function DrawerScreen(props: any) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const getFullName = () => {
    const fullName = [user?.firstName, user?.middleName, user?.lastName]
      .filter((value) => typeof value === "string" && value.trim())
      .join(" ")
      .trim();

    return fullName || user?.name || "User";
  };

  const openURL = async (url: string, title: string) => {
    try {
      console.log(`Attempting to open ${title} URL:`, url);
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error(`Error opening ${title} URL:`, error);
    }
  };

  const handlePrivacyPolicy = () => {
    openURL("https://www.legacyorb.com/privacy", "Privacy Policy");
  };

  const handleHelpAndSupport = () => {
    openURL("https://www.legacyorb.com/support", "Help & Support");
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetChat());
    dispatch(resetTimeline());
  };

  const getProfileImage = () => {
    if (user?.profilePictureUrl) {
      return { uri: `${user.profilePictureUrl}` };
    } else {
      return image.dummyUser;
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={getProfileImage()}
            style={styles.avatar}
            resizeMode={"contain"}
            onError={(e) =>
              console.log("Drawer Image Load Error:", e.nativeEvent.error)
            }
          />
        </View>
        <Typography
          text={getFullName()}
          size={getSize(36, 24)}
          family={fontFamily.RSBold}
          color={color.DarkGray}
          style={styles.name}
        />
        <Typography
          text={user?.email}
          size={getSize(24, 14)}
          family={fontFamily.RSBold}
          color={color.DarkGray}
          style={styles.email}
        />
      </View>
      <View style={styles.menuSection}>
        <DrawerItem
          label="Edit Profile"
          icon={image.user}
          route="Edit"
          navigation={props.navigation}
        />
        <DrawerItem
          label="Reset Password"
          icon={image.resetPassword}
          route="reset-password"
          navigation={props.navigation}
        />
        <DrawerItem
          label="Privacy & Security"
          icon={image.lock}
          route={null}
          onClick={handlePrivacyPolicy}
          navigation={props.navigation}
        />
        <DrawerItem
          label="Help Support"
          icon={image.help}
          onClick={handleHelpAndSupport}
          navigation={props.navigation}
        />
      </View>
      <View style={styles.logoutWrapper}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Image source={image.signOut} style={styles.logoutIcon} />
          <Typography
            text="Sign Out"
            size={fontSize.size16}
            family={fontFamily.RSBold}
            color={color.white}
          />
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
  },

  profileSection: {
    alignItems: "center",
  },

  avatarContainer: {
    width: getSize(140, 96),
    height: getSize(140, 96),
    borderRadius: getSize(250, 70),
    borderWidth: 1,
    borderColor: color.black,
    marginBottom: getHeight(32),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.white,
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  name: {
    marginBottom: getHeight(16),
    textAlign: "center",
  },

  email: {
    marginBottom: getHeight(44),
  },

  menuSection: {
    flexDirection: "column",
    gap: 16,
  },

  menuItem: {
    paddingVertical: getHeight(12),
    paddingHorizontal: getHeight(16),
    borderBottomWidth: 1,
    borderColor: color.WarmGrayTransparent,
    backgroundColor: color.LightSkyBlueTransparent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: getWidth(12),
  },

  menuIcon: {
    width: getSize(32, 22),
    height: getSize(32, 22),
    resizeMode: "contain",
  },

  rightArrow: {
    width: getSize(12, 8),
    height: getSize(20, 12),
  },

  logoutWrapper: {
    paddingHorizontal: getWidth(20),
    marginTop: "auto",
  },

  logoutButton: {
    paddingVertical: getHeight(20),
    paddingHorizontal: getHeight(8),
    borderRadius: getWidth(50),
    borderWidth: 1,
    backgroundColor: color.black,
    borderColor: color.LightGray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: getWidth(10),
    marginBottom: getHeight(18),
  },
  logoutIcon: {
    width: getWidth(18),
    height: getHeight(18),
    resizeMode: "contain",
  },
});
