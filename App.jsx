
import { useState } from "react";
import IntroScreen from "./screens/IntroScreen";
import ConfigScreen from "./screens/ConfigScreen";
import GameScreen from "./screens/GameScreen";

export default function App() {
  const [screen, setScreen] = useState("intro"); 
  const [gridSize, setGridSize] = useState(8);
  const [colorCount, setColorCount] = useState(4);

  if (screen === "intro") {
    return <IntroScreen onFinish={() => setScreen("config")} />;
  }

  if (screen === "config") {
    return (
      <ConfigScreen
        onStartGame={(size, colors) => {
          setGridSize(size);
          setColorCount(colors);
          setScreen("game");
        }}
      />
    );
  }

  if (screen === "game") {
    return (
      <GameScreen
        gridSize={gridSize}
        colorCount={colorCount}
        onBack={() => setScreen("config")}
      />
    );
  }

  return null;
}
