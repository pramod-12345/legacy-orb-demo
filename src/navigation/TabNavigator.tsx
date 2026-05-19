import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, ImageSourcePropType, Image, StyleSheet } from "react-native";
import * as screens from "../screens/index";
import {
  color,
  fontFamily,
  fontSize,
  getSize,
  getWidth,
  isTablet,
} from "../constants/globalConstants";
import { image } from "../assets/images";

const Tab = createBottomTabNavigator();

const TabBarIcon = ({
  focused,
  _focused,
  _unfocused,
}: {
  focused: boolean;
  _focused: ImageSourcePropType;
  _unfocused: ImageSourcePropType;
}) => (
  <Image
    style={[
      styles.tabIcon,
      { tintColor: focused ? color.black : color.CoolGray },
    ]}
    source={focused ? _focused : _unfocused}
  />
);

const TabBarLabel = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text
    style={[
      styles.tabLabel,
      {
        fontFamily: focused
          ? isTablet
            ? fontFamily.RRegular
            : fontFamily.RBold
          : fontFamily.RRegular,
        color: focused ? color.black : color.CoolGray,
        marginLeft: getSize(12, 0),
      },
    ]}
  >
    {label}
  </Text>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "gray",
      tabBarHideOnKeyboard: false,
      tabBarStyle: styles.tabBar,
      tabBarItemStyle: styles.tabBarItem,
      tabBarLabelStyle: styles.tabBarLabelBase,
    }}
  >
    <Tab.Screen
      name={"Chat"}
      component={screens.ChatScreen}
      options={{
        title: "Chat",
        headerShown: false,
        headerLeftContainerStyle: {
          paddingStart: getSize(20, 10),
        },
        headerRightContainerStyle: {
          paddingEnd: getSize(20, 10),
        },
        tabBarLabel: ({ focused }) => (
          <TabBarLabel focused={focused} label="Chat" />
        ),
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            _focused={image.chat}
            _unfocused={image.chat}
          />
        ),
      }}
    />
    <Tab.Screen
      name={"Timeline"}
      component={screens.TimelineScreen}
      options={{
        title: "Timeline",
        headerLeftContainerStyle: {
          paddingStart: 10,
        },
        headerShown: false,
        headerRightContainerStyle: {
          paddingEnd: 10,
        },
        tabBarLabel: ({ focused }) => (
          <TabBarLabel focused={focused} label="Timeline" />
        ),
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            _focused={image.calender}
            _unfocused={image.calender}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabIcon: {
    resizeMode: "contain",
    width: getWidth(22),
    height: getWidth(22),
  },
  tabLabel: {
    fontSize: getSize(24, 12),
  },
  tabBar: {
    height: getSize(100, 65),
    paddingBottom: 5,
  },
  tabBarItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarLabelBase: {
    fontSize: fontSize.size12,
    marginBottom: 4,
  },
});

export default MainTabs;
