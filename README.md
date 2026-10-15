# 🎮 Tic Tac Toe

A classic **Tic Tac Toe** game built with vanilla HTML, CSS, and JavaScript. Features a beautiful glassmorphism UI with gradient background, responsive design, and full game logic including win detection, draw detection, and game reset.

## ✨ Features

- **Two-player gameplay** — X and O take turns on the same device
- **Win detection** — All 8 winning combinations (3 rows, 3 columns, 2 diagonals) are detected instantly
- **Draw detection** — Game correctly identifies when the board is full with no winner
- **Visual feedback** — Winning cells are highlighted with a green glow
- **Turn indicator** — Displays whose turn it is at the top of the screen
- **New Game button** — Appears after a win or draw to restart the game
- **Move prevention** — Cannot click occupied cells or make moves after game ends
- **Responsive design** — Works on desktop and mobile devices
- **Accessible** — ARIA attributes and live regions for screen reader support
- **Glassmorphism UI** — Modern frosted-glass aesthetic with gradient background

## 🛠️ Technologies Used

- **HTML5** — Semantic markup with ARIA accessibility attributes
- **CSS3** — CSS Grid, Flexbox, glassmorphism effects, responsive media queries
- **JavaScript (ES6)** — Vanilla JS with no frameworks or libraries
- **Jest** — Unit testing with jsdom environment

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- [Node.js](https://nodejs.org/) v18+ (only needed for running tests)

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/ticktacktoe.git
   cd ticktacktoe
   ```

2. **Install dev dependencies (for testing only):**
   ```bash
   npm install
   ```

## ▶️ Running Locally

No build step is required. Simply open `index.html` in your browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (recommended)
python3 -m http.server 8080
# Then visit http://localhost:8080
```

You can also use VS Code's **Live Server** extension or any static file server.

## 🧪 Testing

Run the full test suite:

```bash
npm test
```

The test suite includes **22 tests** covering:
- Board initialization and rendering
- Turn alternation (X → O → X)
- Prevention of moves on occupied cells
- Win detection for all 8 winning combinations
- O player winning
- Winning cell highlighting
- Draw/tie detection
- Move blocking after game over
- New Game reset after win and draw
- Win class cleanup after reset
- Edge case: winning on the 9th (last) move

## 📁 Project Structure

```
ticktacktoe-main/
├── index.html        # Main HTML page with game board
├── styles.css        # Styling with glassmorphism and responsive design
├── index.js          # Game logic (turns, win/draw detection, reset)
├── index.test.js     # Jest test suite (22 tests)
├── package.json      # NPM configuration and test script
├── .gitignore        # Git ignore rules
├── README.md         # This file
└── assets/
    ├── favicon.ico   # Browser tab icon
    └── gradient-bg.jpg # Background gradient image
```

## 🎯 How to Play

1. **Player X** goes first — click any empty cell to place your mark
2. **Player O** goes next — players alternate turns
3. Get **three in a row** (horizontally, vertically, or diagonally) to win
4. If all 9 cells are filled with no winner, the game is a **draw**
5. Click **New Game** to play again

## 📱 Responsive Design

The game adapts to different screen sizes:
- **Desktop** — Full-size board centered on screen
- **Mobile** — Smaller board and text sizes for comfortable touch interaction

## 📄 License

ISC
