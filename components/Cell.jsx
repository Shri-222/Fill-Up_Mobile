import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../Constants/colors";
import { useRef, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolateColor,
  Easing,

} from "react-native-reanimated";

export const Cell = React.memo(function Cell({ row, col, color, size, controlled, }) {

  const animatedColor = useSharedValue(color);
  const scale = useSharedValue(1);

  useEffect(() => {
    const distance = Math.sqrt(row * row + col * col);
    const delay = distance * 25; 

    animatedColor.value = withDelay(
      delay,
      withTiming(color, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      })
    );

    scale.value = 0.9;
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 15,
        stiffness: 50,
      })
    );
  }, [color]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: size,
      height: size,
      borderRadius: size * 0.28,
      margin: 2,
      backgroundColor: interpolateColor(
        animatedColor.value,
        Object.keys(COLORS).map(Number),
        Object.values(COLORS)
      ),
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle, 
      ]}
    />
  );
});
