import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const COLORS = ["#9CA3AF", "#93C5FD", "#86EFAC", "#FCD34D", "#FCA5A5", "#C4B5FD"];
const GRID_SIZE = 8;

const AnimatedCell = ({ color }: { color: string }) => {
  const scale = useSharedValue(1);
  const animatedColor = useSharedValue(color);

  useEffect(() => {
    // Smooth color transition
    animatedColor.value = color;
    scale.value = 1.2;
    scale.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
  }, [color]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: animatedColor.value,
  }));

  return <Animated.View style={[styles.cell, animatedStyle]} />;
};

const App = () => {
  const [grid, setGrid] = useState(
    Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => COLORS[Math.floor(Math.random() * COLORS.length)])
      )
  );

  const [moves, setMoves] = useState(0);
  const [controlledColor, setControlledColor] = useState(grid[0][0]);

  const floodFill = (x: number, y: number, target: string, replacement: string, tempGrid: string[][]) => {
    if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return;
    if (tempGrid[y][x] !== target) return;
    tempGrid[y][x] = replacement;
    floodFill(x + 1, y, target, replacement, tempGrid);
    floodFill(x - 1, y, target, replacement, tempGrid);
    floodFill(x, y + 1, target, replacement, tempGrid);
    floodFill(x, y - 1, target, replacement, tempGrid);
  };

  const handleColorSelect = (color: string) => {
    if (color === controlledColor) return;

    // Haptic feedback
    ReactNativeHapticFeedback.trigger("impactMedium", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    const newGrid = grid.map((row) => [...row]);
    floodFill(0, 0, controlledColor, color, newGrid);
    setGrid(newGrid);
    setControlledColor(color);
    setMoves(moves + 1);
  };

  const checkWin = () => {
    const allSame = grid.every((row) => row.every((cell) => cell === grid[0][0]));
    return allSame;
  };

  useEffect(() => {
    if (checkWin()) {
      ReactNativeHapticFeedback.trigger("notificationSuccess");
    }
  }, [grid]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎨 ColorFlow Mobile</Text>
      <Text style={styles.moves}>Moves: {moves}</Text>

      <View style={styles.grid}>
        {grid.map((row, y) =>
          row.map((cellColor, x) => (
            <AnimatedCell key={`${x}-${y}`} color={cellColor} />
          ))
        )}
      </View>

      <View style={styles.palette}>
        {COLORS.map((color, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleColorSelect(color)}
            style={[styles.colorButton, { backgroundColor: color }]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  moves: {
    color: "#FFFFFF",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 320,
    height: 320,
    marginBottom: 20,
  },
  cell: {
    width: 40,
    height: 40,
    margin: 1,
    borderRadius: 5,
  },
  palette: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorButton: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1E293B",
  },
});

export default App;
