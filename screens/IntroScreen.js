
import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function IntroScreen({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={onFinish}>
      <Text style={styles.title}>COLOR GRID</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#60a5fa",
  },
});
