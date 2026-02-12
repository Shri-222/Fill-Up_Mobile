
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Cell } from './Cell'
import {COLORS} from "../Constants/colors";
import { useFloodGame } from "../hooks/floodGame";
import LinearGradient from "react-native-linear-gradient";

export default function GameBoard({ gridSize, colorCount }) {
    const {
        grid,
        moves,
        targetMoves,
        isComplete,
        connectedInfo,
        newGame,
        selectColor,
        undo,
        isAnimating,
    } = useFloodGame(gridSize, colorCount);

    const GAP = 5;
    const { width } = useWindowDimensions();
    const boardMaxWidth = Math.min(width * 0.9, 500);
    const cellSize = (boardMaxWidth - GAP * 2 * gridSize) / gridSize;

    const totalCells = gridSize * gridSize;

    const filledCells = connectedInfo.visited
            .flat()
            .filter(Boolean).length;

    const progress = filledCells / totalCells;


    if (!grid.length) return null;


  return (
    <LinearGradient colors={["#0f172a", "#020617"]} style={styles.container}>
      
      {/* HEADER */}
        <View style={styles.header}>
            <Text style={styles.title}>ColorFlow</Text>

            <Text style={styles.moves}>
                MOVES: {moves}
            </Text>

            <View style={styles.progressBar}>
                <View
                style={[
                    styles.progressFill,
                    { width: `${progress * 100}%` },
                ]}
                />
            </View>

            {isComplete && (
                <Text style={styles.winText}>You Won 🎉</Text>
            )}
        </View>


      {/* BOARD */}
      <View style={[styles.board, { width: boardMaxWidth, }]}>
        {grid.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, j) => (
              <Cell
                key={`${i}-${j}`}
                row={i}
                col={j}
                color={cell}
                size={cellSize}
                controlled={connectedInfo.visited[i][j]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* COLOR PALETTE */}
      <View style={styles.palette}>
        {COLORS.slice(0, colorCount).map((c, i) => (
          <TouchableOpacity
            disabled={isAnimating}
            key={i}
            onPress={() => selectColor(i)}
            style={[styles.colorBtn, { backgroundColor: c }, selectColor === i && styles.selectedColor]}
          />
        ))}
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={undo} style={styles.actionBtn}>
          <Text style={styles.actionText}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={newGame} style={styles.resetBtn}>
          <Text style={styles.actionText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

    header: {
    alignItems: "center",
    marginBottom: 30,
    },

    title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#3b82f6",
    marginBottom: 8,
    },

    moves: {
    fontSize: 14,
    letterSpacing: 2,
    color: "#94a3b8",
    marginBottom: 10,
    },

    progressBar: {
    height: 8,
    width: 220,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 6,
    },

    progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    },


    board: {
        backgroundColor: "#0b1220",
        padding: 16,
        borderRadius: 28,

        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 20 },
        elevation: 25,
    },

   selectedColor: {
  shadowColor: "#60a5fa",
  shadowOpacity: 1,
  shadowRadius: 20,
  elevation: 15,
  transform: [{ scale: 1.1 }],
},

  winText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#22c55e",
  },

  row: {
    flexDirection: "row",
  },

 palette: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 30,
  paddingHorizontal: 16,
},

  colorBtn: {
  width: 56,
  height: 56,
  borderRadius: 28,
  margin: 8,
},


  actions: {
    flexDirection: "row",
    marginTop: 20,
  },

  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#334155",
    borderRadius: 8,
    marginHorizontal: 8,
  },

  resetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    marginHorizontal: 8,
  },

  actionText: {
    color: "white",
    fontWeight: "600",
  },
});
