import { useCallback, useEffect, useMemo, useState } from "react";
import { UNDO_LIMIT } from "../Constants/colors";
import {
  calculateTargetMoves,
  deepClone,
  floodFill,
  generateGrid,
  getConnectedRegionInfo,
} from "../Utils/FloodUtils";

export const useFloodGame = (gridSize, colorCount) => {
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize new game
  const newGame = useCallback(() => {
    const g = generateGrid(gridSize, colorCount);
    setGrid(g);
    setMoves(0);
    setHistory([deepClone(g)]);
  }, [gridSize, colorCount]);

  // Recreate grid when size or color changes
  useEffect(() => {
    newGame();
  }, [gridSize, colorCount]);

    const selectColor = useCallback(async (newColor) => {
        if (!grid.length || isAnimating) return;

        const startColor = grid[0][0];
        if (startColor === newColor) return;

        const size = grid.length;
        const visited = Array.from({ length: size }, () =>
            Array(size).fill(false)
        );

        const queue = [[0, 0]];
        visited[0][0] = true;

        const animationQueue = [];

        // BFS build order
        while (queue.length) {
            const [x, y] = queue.shift();
            animationQueue.push([x, y]);

            for (const [dx, dy] of [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
            ]) {
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 &&
                ny >= 0 &&
                nx < size &&
                ny < size &&
                !visited[nx][ny] &&
                grid[nx][ny] === startColor
            ) {
                visited[nx][ny] = true;
                queue.push([nx, ny]);
            }
            }
        }

        setIsAnimating(true);

        const total = animationQueue.length;
        const BATCH_SIZE = Math.max(4, Math.ceil(total / 10));
        const delay = 25;

        for (let i = 0; i < animationQueue.length; i += BATCH_SIZE) {
            const batch = animationQueue.slice(i, i + BATCH_SIZE);

            setGrid(prev => {
            const copy = prev.map(r => r.slice());
            batch.forEach(([x, y]) => {
                copy[x][y] = newColor;
            });
            return copy;
            });

            await new Promise(r => setTimeout(r, delay));
        }

        setMoves(m => m + 1);
        setIsAnimating(false);

    }, [grid, isAnimating]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) return h;

      const next = h.slice(0, -1);
      setGrid(deepClone(next[next.length - 1]));
      setMoves((m) => Math.max(0, m - 1));
      return next;
    });
  }, []);

  const connectedInfo = useMemo(
    () => getConnectedRegionInfo(grid),
    [grid]
  );

  const isComplete = useMemo(() => {
    if (!grid.length) return false;

    return (
      connectedInfo.connectedSize ===
      gridSize * gridSize
    );
  }, [connectedInfo, gridSize, grid]);

  const targetMoves = useMemo(
    () => calculateTargetMoves(gridSize, colorCount),
    [gridSize, colorCount]
  );

  return {
        grid,
        moves,
        targetMoves,
        gridSize,
        colorCount,
        isComplete,
        connectedInfo,
        newGame,
        selectColor,
        undo,
        isAnimating,
    };
};
