import { createDrawerNavigator } from "@react-navigation/drawer";
import * as screens from "../screens/index";
import CustomDrawerContent from "./CustomDrawerContent";
import MainTabs from "./TabNavigator";
import { color } from "../constants/globalConstants";

const Drawer = createDrawerNavigator();

const MainDrawer = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerType: "front",
      drawerActiveTintColor: color.black,
      drawerInactiveTintColor: "#222222",
      drawerStyle: {
        width: "70%",
      },
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Tabs"
      component={MainTabs}
      options={{ title: "Home", drawerItemStyle: { display: "none" } }}
    />
    <Drawer.Screen
      name="Edit"
      component={screens.EditScreen}
      options={{ title: "Edit Screen", headerShown: false }}
    />
    <Drawer.Screen
      name="reset-password"
      component={screens.ResetPassword}
      options={{ title: "Reset Password", headerShown: false }}
    />
  </Drawer.Navigator>
);

export default MainDrawer;
