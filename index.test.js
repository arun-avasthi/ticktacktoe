/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

function loadGame() {
  // Set up the DOM from index.html body content
  document.body.innerHTML = `
    <div class="wrapper">
      <p class="game-info" aria-live="polite"></p>
      <div class="tic-tac-toe" role="grid" aria-label="Tic Tac Toe Board">
        <div class="box box1" role="gridcell" aria-label="Row 1, Column 1"></div>
        <div class="box box2" role="gridcell" aria-label="Row 1, Column 2"></div>
        <div class="box box3" role="gridcell" aria-label="Row 1, Column 3"></div>
        <div class="box box4" role="gridcell" aria-label="Row 2, Column 1"></div>
        <div class="box box5" role="gridcell" aria-label="Row 2, Column 2"></div>
        <div class="box box6" role="gridcell" aria-label="Row 2, Column 3"></div>
        <div class="box box7" role="gridcell" aria-label="Row 3, Column 1"></div>
        <div class="box box8" role="gridcell" aria-label="Row 3, Column 2"></div>
        <div class="box box9" role="gridcell" aria-label="Row 3, Column 3"></div>
      </div>
      <button class="btn" aria-label="Start New Game">New Game</button>
    </div>
  `;

  // Execute the game script in the jsdom context
  const js = fs.readFileSync(path.resolve(__dirname, "index.js"), "utf8");
  eval(js);

  return {
    boxes: document.querySelectorAll(".box"),
    gameInfo: document.querySelector(".game-info"),
    newGameBtn: document.querySelector(".btn"),
  };
}

describe("Tic Tac Toe Game", () => {
  let boxes, gameInfo, newGameBtn;

  beforeEach(() => {
    ({ boxes, gameInfo, newGameBtn } = loadGame());
  });

  // ── Initialization ──────────────────────────────────────────────

  test("board renders 9 empty cells on init", () => {
    expect(boxes.length).toBe(9);
    boxes.forEach((box) => {
      expect(box.innerText).toBe("");
    });
  });

  test("current player starts as X", () => {
    expect(gameInfo.innerText).toBe("Current Player - X");
  });

  test("New Game button is hidden on init", () => {
    expect(newGameBtn.classList.contains("active")).toBe(false);
  });

  // ── Making moves ────────────────────────────────────────────────

  test("clicking a cell places the current player mark", () => {
    boxes[0].click();
    expect(boxes[0].innerText).toBe("X");
  });

  test("turns alternate between X and O", () => {
    boxes[0].click(); // X
    expect(gameInfo.innerText).toBe("Current Player - O");

    boxes[1].click(); // O
    expect(gameInfo.innerText).toBe("Current Player - X");

    boxes[2].click(); // X
    expect(gameInfo.innerText).toBe("Current Player - O");
  });

  test("clicking an occupied cell does nothing", () => {
    boxes[0].click(); // X plays at 0
    boxes[0].click(); // try again – should be ignored
    expect(boxes[0].innerText).toBe("X");
    // Turn should still be O (no double-swap)
    expect(gameInfo.innerText).toBe("Current Player - O");
  });

  // ── Win detection ───────────────────────────────────────────────

  const winScenarios = [
    { name: "Row 1 (0,1,2)", xMoves: [0, 1, 2], oMoves: [3, 4], winner: "X" },
    { name: "Row 2 (3,4,5)", xMoves: [3, 4, 5], oMoves: [0, 1], winner: "X" },
    { name: "Row 3 (6,7,8)", xMoves: [6, 7, 8], oMoves: [0, 1], winner: "X" },
    { name: "Col 1 (0,3,6)", xMoves: [0, 3, 6], oMoves: [1, 2], winner: "X" },
    { name: "Col 2 (1,4,7)", xMoves: [1, 4, 7], oMoves: [0, 2], winner: "X" },
    { name: "Col 3 (2,5,8)", xMoves: [2, 5, 8], oMoves: [0, 1], winner: "X" },
    { name: "Diag (0,4,8)", xMoves: [0, 4, 8], oMoves: [1, 2], winner: "X" },
    { name: "Anti-diag (2,4,6)", xMoves: [2, 4, 6], oMoves: [0, 1], winner: "X" },
  ];

  test.each(winScenarios)(
    "detects X winning via $name",
    ({ xMoves, oMoves, winner }) => {
      // Interleave moves: X, O, X, O, X
      for (let i = 0; i < xMoves.length; i++) {
        boxes[xMoves[i]].click();
        if (i < oMoves.length) {
          boxes[oMoves[i]].click();
        }
      }
      expect(gameInfo.innerText).toBe(`Winner Player - ${winner}`);
      expect(newGameBtn.classList.contains("active")).toBe(true);
    }
  );

  test("detects O winning", () => {
    // X plays 0, O plays 3, X plays 1, O plays 4, X plays 8, O plays 5
    // O wins with row 2 (3,4,5)
    boxes[0].click(); // X at 0
    boxes[3].click(); // O at 3
    boxes[1].click(); // X at 1
    boxes[4].click(); // O at 4
    boxes[8].click(); // X at 8
    boxes[5].click(); // O at 5 → O wins
    expect(gameInfo.innerText).toBe("Winner Player - O");
  });

  test("winning cells get 'win' class", () => {
    // X wins with 0, 1, 2
    boxes[0].click(); // X
    boxes[3].click(); // O
    boxes[1].click(); // X
    boxes[4].click(); // O
    boxes[2].click(); // X wins

    expect(boxes[0].classList.contains("win")).toBe(true);
    expect(boxes[1].classList.contains("win")).toBe(true);
    expect(boxes[2].classList.contains("win")).toBe(true);
    // Non-winning cells should not have 'win'
    expect(boxes[3].classList.contains("win")).toBe(false);
    expect(boxes[4].classList.contains("win")).toBe(false);
  });

  // ── Draw detection ──────────────────────────────────────────────

  test("detects a draw when all cells are filled with no winner", () => {
    // Sequence: 0(X), 1(O), 2(X), 4(O), 3(X), 6(O), 5(X), 8(O), 7(X)
    // Grid:  X O X
    //        X O X
    //        O X O  ← draw
    const moves = [0, 1, 2, 4, 3, 6, 5, 8, 7];
    moves.forEach((i) => boxes[i].click());

    expect(gameInfo.innerText).toBe("Game Tied !");
    expect(newGameBtn.classList.contains("active")).toBe(true);
  });

  // ── Game cannot continue after win ──────────────────────────────

  test("moves are blocked after a win", () => {
    // X wins with top row
    boxes[0].click(); // X
    boxes[3].click(); // O
    boxes[1].click(); // X
    boxes[4].click(); // O
    boxes[2].click(); // X wins

    // pointer events should be "none" on all boxes
    boxes.forEach((box) => {
      expect(box.style.pointerEvents).toBe("none");
    });
  });

  // ── Reset / New Game ────────────────────────────────────────────

  test("New Game button resets the board after a win", () => {
    // X wins
    boxes[0].click();
    boxes[3].click();
    boxes[1].click();
    boxes[4].click();
    boxes[2].click();

    // Click New Game
    newGameBtn.click();

    // Board should be empty
    boxes.forEach((box) => {
      expect(box.innerText).toBe("");
      expect(box.style.pointerEvents).toBe("all");
    });
    expect(gameInfo.innerText).toBe("Current Player - X");
    expect(newGameBtn.classList.contains("active")).toBe(false);
  });

  test("New Game button resets the board after a draw", () => {
    const moves = [0, 1, 2, 4, 3, 6, 5, 8, 7];
    moves.forEach((i) => boxes[i].click());

    newGameBtn.click();

    boxes.forEach((box) => {
      expect(box.innerText).toBe("");
    });
    expect(gameInfo.innerText).toBe("Current Player - X");
  });

  test("win class is removed after reset", () => {
    boxes[0].click();
    boxes[3].click();
    boxes[1].click();
    boxes[4].click();
    boxes[2].click();

    newGameBtn.click();

    boxes.forEach((box) => {
      expect(box.classList.contains("win")).toBe(false);
    });
  });

  // ── Edge cases ──────────────────────────────────────────────────

  test("winning on the last move (9th) is a win, not a draw", () => {
    // Move order: 0(X) 1(O) 4(X) 3(O) 2(X) 5(O) 6(X) 7(O) 8(X) ← X wins diag
    const moves = [0, 1, 4, 3, 2, 5, 6, 7, 8];
    moves.forEach((i) => boxes[i].click());

    expect(gameInfo.innerText).toBe("Winner Player - X");
    expect(newGameBtn.classList.contains("active")).toBe(true);
  });
});
