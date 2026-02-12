import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfigScreen({ onStartGame }) {
  const [selectedSize, setSelectedSize] = useState(8);
  const [selectedColors, setSelectedColors] = useState(6);

  const sizes = [8, 12, 16, 20];
  const colors = [4, 5, 6];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ColorFlow</Text>

      {/* GRID SIZE */}
      <Text style={styles.label}>GRID SIZE</Text>
      <View style={styles.segmentContainer}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.segmentButton,
              selectedSize === size && styles.segmentActive,
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSize === size && styles.segmentTextActive,
              ]}
            >
              {size}×{size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NUMBER OF COLORS */}
      <Text style={styles.label}>NUMBER OF COLORS</Text>
      <View style={styles.segmentContainer}>
        {colors.map((count) => (
          <TouchableOpacity
            key={count}
            style={[
              styles.segmentButton,
              selectedColors === count && styles.segmentActive,
            ]}
            onPress={() => setSelectedColors(count)}
          >
            <Text
              style={[
                styles.segmentText,
                selectedColors === count && styles.segmentTextActive,
              ]}
            >
              {count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* START BUTTON */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => onStartGame(selectedSize, selectedColors)}
      >
        <Text style={styles.startText}>START GAME</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>READY TO FLOW?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 50,
    textAlign : 'center'
  },

  label: {
    color: "#64748b",
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 20,
  },

  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 6,
    justifyContent: "space-between",
  },

  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },

  segmentActive: {
    backgroundColor: "#2563eb",
  },

  segmentText: {
    color: "#94a3b8",
    fontWeight: "600",
  },

  segmentTextActive: {
    color: "white",
  },

  startButton: {
    marginTop: 40,
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },

  startText: {
    color: "white",
    fontWeight: "700",
    letterSpacing: 1,
  },

  footer: {
    marginTop: 80,
    textAlign: "center",
    color: "#334155",
    letterSpacing: 3,
    fontSize: 10,
  },
});
