import React, { useContext } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { ActivityContext } from "../store/activity-context";

type Props = {
  children: React.ReactNode;
};

const ActivityWrapper = ({ children }: Props) => {
  const { registerActivity } = useContext(ActivityContext);

  return (
    <TouchableWithoutFeedback onPress={registerActivity}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default ActivityWrapper;
