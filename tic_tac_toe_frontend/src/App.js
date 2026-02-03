import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const PLAYER_X = "X";
const PLAYER_O = "O";

/**
 * Returns the winner for a given board state, or null if there is no winner.
 * Board is an array of 9 values: "X", "O", or null.
 */
function calculateWinner(board) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isDraw(board) {
  return board.every((cell) => cell !== null);
}

function getNextPlayer(xIsNext) {
  return xIsNext ? PLAYER_X : PLAYER_O;
}

function getCellAriaLabel(value, index, isDisabled) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const base = `Row ${row}, Column ${col}`;
  if (value) return `${base}. Marked ${value}.`;
  if (isDisabled) return `${base}. Disabled.`;
  return `${base}. Empty. Click to place your mark.`;
}

// PUBLIC_INTERFACE
function App() {
  /** This is the main Tic Tac Toe application component (UI + game logic). */
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(board), [board]);
  const nextPlayer = getNextPlayer(xIsNext);
  const gameOver = Boolean(winner) || isDraw(board);

  // Keep the template's theme mechanism, defaulting to "light" to match style guide background.
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light/dark theme for accessibility and user preference. */
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    /** Handles a user move by placing X/O on an empty cell, if the game isn't over. */
    if (board[index] !== null) return;
    if (winner) return;

    setBoard((prev) => {
      const next = prev.slice();
      next[index] = nextPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Resets the game to its initial state. */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw(board)
      ? "Draw"
      : `Turn: ${nextPlayer}`;

  const statusSubtext = winner
    ? "Game over — press Reset to play again."
    : isDraw(board)
      ? "No more moves — press Reset to try again."
      : "Place your mark on the board.";

  return (
    <div className="App">
      <main className="ttt-page">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          type="button"
        >
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>

        <section className="ttt-card" aria-label="Tic tac toe game">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <div className="ttt-status" role="status" aria-live="polite">
              <div className="ttt-status-main">{statusText}</div>
              <div className="ttt-status-sub">{statusSubtext}</div>
            </div>
          </header>

          <div
            className="ttt-board"
            role="grid"
            aria-label="Tic tac toe board"
            aria-describedby="ttt-instructions"
          >
            {board.map((value, index) => {
              const isWinningCell = line ? line.includes(index) : false;
              const isDisabled = gameOver || value !== null;

              return (
                <button
                  key={index}
                  type="button"
                  className={[
                    "ttt-cell",
                    value ? "ttt-cell--filled" : "",
                    isWinningCell ? "ttt-cell--win" : "",
                    value === PLAYER_X ? "ttt-cell--x" : "",
                    value === PLAYER_O ? "ttt-cell--o" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleCellClick(index)}
                  disabled={isDisabled}
                  aria-label={getCellAriaLabel(value, index, isDisabled)}
                  role="gridcell"
                >
                  <span className="ttt-cell-value" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <p id="ttt-instructions" className="ttt-help">
            Two players, same device. X goes first.
          </p>

          <div className="ttt-actions">
            <button className="ttt-reset" type="button" onClick={resetGame}>
              Reset
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
