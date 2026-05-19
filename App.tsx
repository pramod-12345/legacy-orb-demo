import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { Appearance, Platform, StatusBar, StyleSheet } from "react-native";
import { setLoaderRef } from "./src/constants/Globals";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Loader from "./src/components/shared/loader";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store";
import ActivityWrapper from "./src/components/activity-wrapper";
import { ActivityProvider } from "./src/store/activity-context";
import SplashScreen from "./src/screens/splash";
import { color } from "./src/constants/globalConstants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setupSslPinning } from "./src/utils/security";

Appearance.setColorScheme("light");

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor={color.black} />
          <SafeAreaView
            style={styles.container}
            edges={Platform.OS === "ios" ? ["top"] : ["bottom", "top"]}
          >
            {showSplash ? (
              <SplashScreen />
            ) : (
              <>
                <ActivityProvider>
                  <ActivityWrapper>
                    <AppNavigator />
                  </ActivityWrapper>
                </ActivityProvider>
                <Loader ref={(ref) => setLoaderRef(ref)} />
              </>
            )}
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
