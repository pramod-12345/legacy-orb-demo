import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { AppState, Keyboard, StyleSheet, View } from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setInActiveTime, setLastActivityTime } from "./slices/authSlice";
import logger from "../utils/logger";

export const ActivityContext = createContext<any>(null);

type Props = {
  children: React.ReactNode;
};

export const ActivityProvider = ({ children }: Props) => {
  const appState = useRef(AppState.currentState);
  const dispatch = useAppDispatch();
  const [isForeground, setIsForeground] = useState(true);
  const { inActiveTime, lastActivityTime } = useAppSelector(
    (state) => state.auth,
  );
  const safeLastActivityTime = lastActivityTime ?? Date.now();
  const safeInActiveTime = inActiveTime ?? 0;

  logger.log("lastActivityTime>>", safeLastActivityTime);

  // ===============================
  // USER ACTIVITY DETECTOR
  // ===============================

  const registerActivity = useCallback(() => {
    dispatch(setLastActivityTime(Date.now()));
    dispatch(setInActiveTime(0));
  }, [dispatch]);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedActivity = useRef(
    debounce(() => {
      dispatch(setLastActivityTime(Date.now()));
    }, 2000),
  ).current;

  const handleActivity = useCallback(() => {
    debouncedActivity();
  }, [debouncedActivity]);

  // ===============================
  // APP FOREGROUND / BACKGROUND
  // ===============================

  useEffect(() => {
    const appStateSub = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        setIsForeground(true);
        handleActivity();
      }
      if (nextState.match(/background|inactive/)) {
        setIsForeground(false);
      }

      appState.current = nextState;
    });

    const keyboardSub = Keyboard.addListener("keyboardDidShow", handleActivity);

    return () => {
      appStateSub.remove();
      keyboardSub.remove();
    };
  }, [handleActivity]);

  const contextValue = {
    isForeground,
    lastActivityTime: safeLastActivityTime,
    inActiveTime: safeInActiveTime,
    registerActivity,
  };

  return (
    <ActivityContext.Provider value={contextValue}>
      <View
        style={styles.container}
        onTouchStart={handleActivity}
        onResponderMove={handleActivity}
      >
        {children}
      </View>
    </ActivityContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
