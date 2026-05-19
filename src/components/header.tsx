import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { image } from "../assets/images";
import Typography from "./shared/typography";
import { color, fontFamily, getSize } from "../constants/globalConstants";
import { DrawerActions, useNavigation } from "@react-navigation/native";

interface HeaderProps {
  isBack?: boolean;
  isMenu?: boolean;
  onRightActionPress?: () => void;
}

const Header = ({ isBack, isMenu, onRightActionPress }: HeaderProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      {/* Header Left */}
      <View style={styles.leftContainer}>
        {isBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={image.leftArrow} style={styles.leftArrow} />
          </TouchableOpacity>
        )}
        {isMenu && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              navigation.getParent()?.dispatch(DrawerActions.openDrawer())
            }
          >
            <Image source={image.hamburger} style={styles.hamburger} />
          </TouchableOpacity>
        )}
      </View>
      {/* Header Center */}
      <View style={styles.centerContainer}>
        <Image source={image.legacyOrbLogo} style={styles.logo} />
        <Typography
          text={"Legacy Orb"}
          size={getSize(32, 24)}
          color={color.black}
          family={fontFamily.RRegular}
        />
      </View>
      {/* Header Right */}
      <View style={styles.rightContainer}>
        {onRightActionPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightActionPress}
          >
            <Image source={image.plus} style={styles.plusIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: getSize(92, 62),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#A7A299",
  },
  leftContainer: {
    width: getSize(42, 32),
    height: "100%",
  },
  iconButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  leftArrow: {
    width: getSize(24, 12),
    height: getSize(26, 18),
    resizeMode: "contain",
  },
  hamburger: {
    width: getSize(30, 20),
    height: getSize(30, 20),
    resizeMode: "contain",
  },
  centerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: getSize(20, 10),
  },
  logo: {
    width: getSize(66, 46),
    height: getSize(56, 36),
    resizeMode: "contain",
  },
  rightContainer: {
    width: 32,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

export default Header;
