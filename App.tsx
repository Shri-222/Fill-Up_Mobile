import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolateColor,
  useAnimatedProps,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import ConfettiCannon from "react-native-confetti-cannon";

const { width } = Dimensions.get("window");

const COLORS = ["#9CA3AF", "#93C5FD", "#86EFAC", "#FCD34D", "#FCA5A5", "#C4B5FD"];
const GRID_SIZE = 8;
const TILE_SIZE = 40;

// ------------------ Animated Gradient ------------------
const GradientBackground = ({ progress }: { progress: Animated.SharedValue<number> }) => {
  const color1 = useSharedValue("#0F172A");
  const color2 = useSharedValue("#1E293B");

  // Animate color transition manually
  const animatedStyle = useAnimatedStyle(() => {
    const start = interpolateColor(progress.value, [0, 1], ["#0F172A", "#1E293B"]);
    const end = interpolateColor(progress.value, [0, 1], ["#1E293B", "#334155"]);
    color1.value = start;
    color2.value = end;
    return { opacity: 1 }; // placeholder for animation sync
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <LinearGradient
        colors={[color1.value, color2.value]}
        useAngle
        angle={135}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

// ------------------ Animated Cell ------------------
const AnimatedCell = ({ color, delay }: { color: string; delay: number }) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    scale.value = 1.3;
    glow.value = 1;
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.exp) })
    );
    glow.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) })
    );
  }, [color]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: color,
    transform: [{ scale: scale.value }],
    shadowColor: color,
    shadowOpacity: glow.value * 0.8,
    shadowRadius: glow.value * 15,
  }));

  return <Animated.View style={[styles.cell, style]} />;
};

// ------------------ Main Game ------------------
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
  const [won, setWon] = useState(false);
  const confettiRef = useRef<any>(null);

  const bgProgress = useSharedValue(0);

  // ---------------- Flood Fill ----------------
  const bfsFloodFill = (targetColor: string, replacementColor: string) => {
    const tempGrid = grid.map((r) => [...r]);
    const queue: [number, number, number][] = [[0, 0, 0]];
    const visited = new Set<string>();
    const updates: { x: number; y: number; depth: number }[] = [];

    while (queue.length) {
      const [x, y, depth] = queue.shift()!;
      const key = `${x}-${y}`;
      if (
        x < 0 ||
        y < 0 ||
        x >= GRID_SIZE ||
        y >= GRID_SIZE ||
        visited.has(key) ||
        tempGrid[y][x] !== targetColor
      )
        continue;
      visited.add(key);
      updates.push({ x, y, depth });
      tempGrid[y][x] = replacementColor;
      queue.push([x + 1, y, depth + 1]);
      queue.push([x - 1, y, depth + 1]);
      queue.push([x, y + 1, depth + 1]);
      queue.push([x, y - 1, depth + 1]);
    }

    return { newGrid: tempGrid, updates };
  };

  const handleColorSelect = (color: string) => {
    if (color === controlledColor || won) return;

    ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: true });
    const { newGrid, updates } = bfsFloodFill(controlledColor, color);
    setControlledColor(color);
    setMoves((m) => m + 1);

    bgProgress.value = withTiming(Math.random(), { duration: 1200 });

    updates.forEach(({ x, y, depth }) => {
      const delay = depth * 60;
      setTimeout(() => {
        setGrid((prev) => {
          const copy = prev.map((r) => [...r]);
          copy[y][x] = color;
          return copy;
        });
      }, delay);
    });
  };

  const checkWin = () => grid.every((row) => row.every((cell) => cell === grid[0][0]));

  useEffect(() => {
    if (checkWin() && !won) {
      setWon(true);
      ReactNativeHapticFeedback.trigger("notificationSuccess");
      confettiRef.current?.start();
    }
  }, [grid]);

  return (
    <SafeAreaProvider style={styles.container}>
      <GradientBackground progress={bgProgress} />

      <Text style={styles.title}>ColorFlow+</Text>
      <Text style={styles.moves}>Moves: {moves}</Text>

      <View style={styles.grid}>
        {grid.map((row, y) =>
          row.map((cellColor, x) => (
            <AnimatedCell key={`${x}-${y}`} color={cellColor} delay={(x + y) * 15} />
          ))
        )}
      </View>

      <View style={styles.palette}>
        {COLORS.map((color, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleColorSelect(color)}
            style={[
              styles.colorButton,
              {
                backgroundColor: color,
                borderWidth: color === controlledColor ? 3 : 2,
                borderColor: color === controlledColor ? "#FFFFFF" : "#9AA5B7",
              },
            ]}
          />
        ))}
      </View>

      {won && (
        <ConfettiCannon
          ref={confettiRef}
          count={80}
          origin={{ x: width / 2, y: 0 }}
          autoStart={false}
          fadeOut
        />
      )}
    </SafeAreaProvider>
  );
};

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
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
    width: GRID_SIZE * (TILE_SIZE + 2),
    height: GRID_SIZE * (TILE_SIZE + 2),
    marginBottom: 20,
  },
  cell: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#000000",
  },
  palette: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorButton: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 25,
  },
});

export default App;
