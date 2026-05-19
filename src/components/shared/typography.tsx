import React from "react";
import { Text, TextStyle } from "react-native";

interface TypographyProps {
  text: string | undefined;
  color?: string;
  size: number;
  family?: string;
  lineheight?: number;
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

const Typography: React.FC<TypographyProps> = ({
  text,
  color,
  size,
  family,
  lineheight,
  style,
  numberOfLines,
  ellipsizeMode,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={{
        color: color,
        fontFamily: family,
        fontSize: size,
        lineHeight: lineheight,
        ...style,
      }}
    >
      {text}
    </Text>
  );
};

export default Typography;
