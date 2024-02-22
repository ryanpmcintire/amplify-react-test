import { useState } from "react";

function Square({ value,onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext,squares,onPlay }) {
  function handleClick(i) {
    if(calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();

    if(xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if(winner) {
    status = `Winner is: ${winner}`;
  } else {
    status = `Next player is: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">
        {status}
      </div>

      {populateBoard()}
    </>
  );

  function populateBoard() {
    return [...Array(3)].map((_,rowOffset) => {
      return (
        <div key={rowOffset} className="board-row">
          {populateRow(rowOffset * 3)}
        </div>
      )
    })
  }

  function populateRow(rowOffset) {
    return [...Array(3)].map((_,i) => {
      return <Square key={i + rowOffset} value={squares[i + rowOffset]} onSquareClick={() => handleClick(i + rowOffset)} />;
    });
  }
}

export default function Game() {
  const [history,setHistory] = useState([Array(9).fill(null)]);
  const [currentMove,setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0,currentMove + 1),nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares,move) => {
    let description;

    if(move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = 'Go to game start';
    }

    const goToMoveButton = <button onClick={() => jumpTo(move)}>{description}</button>;
    const currentMoveDisplay = <span>You are at move #{move}</span>;

    return (
      <ul key={move}>
        {move === currentMove ? currentMoveDisplay : goToMoveButton}
      </ul>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
