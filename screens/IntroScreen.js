import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function IntroScreen({ onFinish }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  const tiles = [
    "#3b82f6",
    "#8b5cf6",
    "#2563eb",
    "#ef4444",
    "#10b981",
    "#f97316",
    "#ec4899",
    "#60a5fa",
    "#7c3aed",
  ];

  return (
    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onFinish}>
      <LinearGradient
        colors={["#0f172a", "#020617"]}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.logoGridWrapper,
            { transform: [{ scale: scaleAnim }, { rotate: "12deg" }] },
          ]}
        >
          <View style={styles.grid}>
            {tiles.map((color, index) => (
              <View
                key={index}
                style={[
                  styles.tile,
                  {
                    backgroundColor: color,
                    shadowColor: color,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        <Text style={styles.title}>
          Color
          <Text style={styles.titleHighlight}>Flow</Text>
        </Text>

        <Text style={styles.subtitle}>THE ART OF CONNECTION</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logoGridWrapper: {
    marginBottom: 40,
  },

  grid: {
    width: 110,
    height: 110,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
  },

  tile: {
    width: 26,
    height: 26,
    borderRadius: 8,
    marginBottom: 6,

    // iOS shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,

    // Android glow
    elevation: 6,
  },

  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
    letterSpacing: -1,
  },

  titleHighlight: {
    color: "#2563eb",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 12,
    letterSpacing: 4,
    color: "rgba(96,165,250,0.5)",
  },
});
