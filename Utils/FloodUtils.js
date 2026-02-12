import { DIRECTIONS } from "../Constants/colors";

export const deepClone = (v) =>
  JSON.parse(JSON.stringify(v));

export const generateGrid = (size, colors) => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * colors))
  );
};

export const calculateTargetMoves = (size, colors) =>
  Math.max(1, Math.floor(0.8 * size + colors * 1.5));

export const getConnectedRegionInfo = (grid) => {
  if (!grid || !grid.length)
    return { visited: [], connectedSize: 0 };

  const size = grid.length;
  const visited = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  const startColor = grid[0][0];
  const queue = [[0, 0]];
  visited[0][0] = true;
  let connectedSize = 1;

  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of DIRECTIONS) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 && nx < size &&
        ny >= 0 && ny < size &&
        !visited[nx][ny] &&
        grid[nx][ny] === startColor
      ) {
        visited[nx][ny] = true;
        queue.push([nx, ny]);
        connectedSize++;
      }
    }
  }

  return { visited, connectedSize };
};

export const floodFill = (grid, newColor) => {
  const size = grid.length;
  const startColor = grid[0][0];
  if (startColor === newColor) return grid;

  const newGrid = grid.map((r) => r.slice());
  const visited = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  const queue = [[0, 0]];
  visited[0][0] = true;

  while (queue.length) {
    const [x, y] = queue.shift();
    newGrid[x][y] = newColor;

    for (const [dx, dy] of DIRECTIONS) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 && nx < size &&
        ny >= 0 && ny < size &&
        !visited[nx][ny] &&
        grid[nx][ny] === startColor
      ) {
        visited[nx][ny] = true;
        queue.push([nx, ny]);
      }
    }
  }

  return newGrid;
};
