# ColorFlow 🎨

A customizable strategy-based color flood puzzle game built with React Native.

ColorFlow challenges players to strategically flood a grid starting from the top-left tile, unifying the board into a single color within limited moves. The game supports multiple grid sizes and difficulty levels, offering scalable complexity.

---

## 🚀 Features (V1.0.0)

- 🎯 Dynamic grid sizes (8×8, 12×12, 16×16, 20×20)
- 🎨 Adjustable difficulty (4, 6, or 8 colors)
- 🔄 Undo functionality with history stack
- 🔁 Restart game option
- ✨ Smooth animated flood propagation
- 📱 Responsive layout for different screen sizes
- 🔙 Back navigation support
- 🧠 Move counter with win detection

---

## 🧩 Gameplay

- The game starts from the top-left tile.
- Selecting a color floods all connected tiles of the same color.
- The goal is to unify the entire board within a limited number of moves.
- Larger grids and more colors increase difficulty.

---

## 🛠 Tech Stack

- React Native
- JavaScript
- Android (Gradle build system)

---

## 🧠 Technical Highlights

This project demonstrates:

- Breadth-First Search (BFS) flood fill algorithm
- Deep cloning strategy for immutable state updates
- Custom undo history stack implementation
- Optimized grid rendering
- Animated state transitions
- Android release signing configuration
- Production AAB generation for Play Store

---

## 📁 Project Structure

```
/android
/src
  /components
  /screens
  /utils
App.js
```

Core logic includes:
- Flood algorithm
- Move tracking
- History stack management

---

## 🏗 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/fill-up.git
```

Install dependencies:

```bash
npm install
```

Run on Android:

```bash
npx react-native run-android
```

---

## 📦 Build Release (Android)

From the `android` directory:

```bash
.\gradlew bundleRelease
```

Output file:

```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🎯 Learning Outcomes

This project was built to:

- Understand React Native performance constraints
- Implement algorithm-based gameplay logic
- Learn Android app signing and release pipeline
- Publish an application to Google Play Store

---

## 📈 Future Improvements (Planned V2)

- Difficulty balancing improvements
- Time-based challenge mode
- Sound and haptic feedback
- Performance optimization for larger grids
- UI refinements

---

## 📄 License

This project is licensed under the MIT License.
