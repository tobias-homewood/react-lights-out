import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let r = 0; r < nrows; r++) {
      let row = [];
      for (let c = 0; c < ncols; c++) {
        row.push(Math.random() < chanceLightStartsOn); // random [0, 0.999999...] < 0.5 is like a 50% chance
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    // .every()  // checks a condition si met in every element of an array
    // .any() // checks if a condition is met in any element of an array
    return board.every(row => row.every(cell => !cell)); // not false = true, that means the light is off
  }

  function flipCellsAround(row, col) {
    setBoard(oldBoard => {
      // const [row, col] = coord.split("-").map(Number); // `1-2` -> [1, 2]

      const flipCell = (row, col, boardCopy) => {
        // if this coord is actually on board, flip it
        if (col >= 0 && col < ncols && row >= 0 && row < nrows) {
          boardCopy[row][col] = !boardCopy[row][col];
        }
      };

      // Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => [...row]);

      // in the copy, flip this cell and the cells around it
      flipCell(row, col, boardCopy);  // flip initial cell
      flipCell(row - 1, col, boardCopy);  // flip cell above
      flipCell(row + 1, col, boardCopy);  // flip cell below
      flipCell(row, col - 1, boardCopy);  // flip cell to the left
      flipCell(row, col + 1, boardCopy);  // flip cell to the right

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>You won!</div>;
  }

  return (
    <table className="Board">
      <tbody>
        {board.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((value, colIdx) => (
              <Cell
                key={`${rowIdx}-${colIdx}`}
                isLit={value}
                flipCellsAroundMe={() => flipCellsAround(rowIdx,colIdx)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Board;
