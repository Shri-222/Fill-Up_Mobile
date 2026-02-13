
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import GameBoard from "../components/GameBoard";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GameScreen({ gridSize, colorCount, onBack }) {

  return (
    <View style={styles.container}>
      
      {/* TOP NAV */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="#e2e8f0" />
        </TouchableOpacity>

        <View style={{ width: 24 }} /> 
        {/* spacer to balance layout */}

      </View>

      <GameBoard gridSize={gridSize} colorCount={colorCount} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 10,
    borderRadius: 20,
  },
});