import React, { useState, useEffect } from 'react';

// Define types
interface Position {
  row: number;
  col: number;
}

type ComparisonType = '>' | '=' | '<' | null;
type GamePhase = 'move' | 'response';

const NumberMazeGame: React.FC = () => {
  const boardSize: number = 10;
  const [board, setBoard] = useState<number[][]>([]);
  const [player1Position, setPlayer1Position] = useState<Position>({ row: 0, col: 0 });
  const [player2Position, setPlayer2Position] = useState<Position>({ row: 9, col: 9 });
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gamePhase, setGamePhase] = useState<GamePhase>('move');
  const [gameStatus, setGameStatus] = useState<string>('Player 1: Select a neighbor cell to move to');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [, setWinner] = useState<1 | 2 | null>(null);
  const [lastMoveComparison, setLastMoveComparison] = useState<ComparisonType>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);

  // Initialize the board with random numbers
  useEffect(() => {
    initializeBoard();
  }, []);

  useEffect(() => {
    if (!gameOver && board.length > 0) {
      highlightValidMoves();
    }
  }, [currentPlayer, gamePhase, player1Position, player2Position, board, gameOver]);

  // Use useEffect to automatically detect and handle no-move situations
  useEffect(() => {
    if (gamePhase === 'response' && validMoves.length === 0 && !gameOver) {
      // Auto-skip turn after a short delay to allow the player to see the message
      const timer = setTimeout(() => {
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setGamePhase('move');
        setGameStatus(`Player ${currentPlayer} had no valid response. Player ${nextPlayer}'s turn to move.`);
      }, 1500); // 1.5 second delay before advancing
      
      return () => clearTimeout(timer);
    }
  }, [gamePhase, validMoves.length, currentPlayer, gameOver]);

  const initializeBoard = (): void => {
    const newBoard: number[][] = Array(boardSize).fill(null).map(() => 
      Array(boardSize).fill(null).map(() => Math.floor(Math.random() * 100) + 1)
    );
    setBoard(newBoard);
    // Don't call highlightValidMoves here - it will be called by the useEffect when board changes
  };

  const resetGame = (): void => {
    initializeBoard();
    setPlayer1Position({ row: 0, col: 0 });
    setPlayer2Position({ row: 9, col: 9 });
    setCurrentPlayer(1);
    setGamePhase('move');
    setGameStatus('Player 1: Select a neighbor cell to move to');
    setGameOver(false);
    setWinner(null);
    setLastMoveComparison(null);
    setValidMoves([]);
  };

  const highlightValidMoves = (): void => {
    if (gameOver || board.length === 0) {
      setValidMoves([]);
      return;
    }

    const currentPos = currentPlayer === 1 ? player1Position : player2Position;
    if (!board[currentPos.row] || board[currentPos.row][currentPos.col] === undefined) {
      return;
    }
    const currentValue = board[currentPos.row][currentPos.col];
    
    // For move phase - all neighbors are valid
    if (gamePhase === 'move') {
      const neighbors = getNeighborCells(currentPos);
      setValidMoves(neighbors);
    } 
    // For response phase - only neighbors that satisfy the comparison are valid
    else if (gamePhase === 'response' && lastMoveComparison) {
      // We only need the neighbor cells for the current player in response phase
      const neighbors = getNeighborCells(currentPos);
      const validResponses = neighbors.filter(pos => {
        const neighborValue = board[pos.row][pos.col];
        
        if (lastMoveComparison === '>') {
          return neighborValue > currentValue;
        } else if (lastMoveComparison === '=') {
          return neighborValue === currentValue;
        } else if (lastMoveComparison === '<') {
          return neighborValue < currentValue;
        }
        return false;
      });
      
      setValidMoves(validResponses);
    }
  };

  const getNeighborCells = (position: Position): Position[] => {
    const { row, col } = position;
    const neighbors: Position[] = [];
    
    // Check all four directions
    const directions: Position[] = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }   // right
    ];
    
    directions.forEach(dir => {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      // Check if the new position is within bounds
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        neighbors.push({ row: newRow, col: newCol });
      }
    });
    
    return neighbors;
  };

  const handleCellClick = (row: number, col: number): void => {
    if (gameOver) return;
    
    const clickedPosition: Position = { row, col };
    
    // Check if the clicked cell is a valid move
    const isValidMove = validMoves.some(move => move.row === row && move.col === col);
    
    if (!isValidMove) {
      return;
    }
    
    // Update player position
    if (currentPlayer === 1) {
      setPlayer1Position(clickedPosition);
      
      // Immediately check if Player 1 has won by reaching bottom-right
      if (row === 9 && col === 9) {
        setGameOver(true);
        setWinner(1);
        setGameStatus('Player 1 wins!');
        return;
      }
    } else {
      setPlayer2Position(clickedPosition);
      
      // Immediately check if Player 2 has won by reaching top-left
      if (row === 0 && col === 0) {
        setGameOver(true);
        setWinner(2);
        setGameStatus('Player 2 wins!');
        return;
      }
    }
    
    if (gamePhase === 'move') {
      // Handle move phase
      const currentPos = currentPlayer === 1 ? player1Position : player2Position;
      const currentValue = board[currentPos.row][currentPos.col];
      const newValue = board[row][col];
      
      // Determine the comparison used
      let comparison: ComparisonType;
      if (newValue > currentValue) {
        comparison = '>';
      } else if (newValue < currentValue) {
        comparison = '<';
      } else {
        comparison = '=';
      }
      
      // Store the comparison for the response phase
      setLastMoveComparison(comparison);
      
      // Switch to response phase and opponent
      setGamePhase('response');
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setGameStatus(`Player ${currentPlayer === 1 ? 2 : 1}: Respond with a ${comparison} move`);
    } else {
      // Handle response phase
      // Switch to move phase for the same player
      setGamePhase('move');
      setGameStatus(`Player ${currentPlayer}: Select a neighbor cell to move to`);
    }
  };

  const isCellValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  // Function to determine cell size based on viewport width
  const getCellSize = () => {
    // Use a responsive approach to cell sizing
    // This will be applied as a CSS class
    return "responsive-cell";
  };

  // Function to toggle rules visibility on mobile
  const [showRules, setShowRules] = useState(false);
  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 max-w-full mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Number Maze Game</h1>
      
      <div className="mb-2 sm:mb-4 text-center w-full px-2">
        <p className="mb-1 sm:mb-2 text-sm sm:text-base">{gameStatus.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p className="font-bold text-sm sm:text-base">Current Player: {currentPlayer} | Phase: {gamePhase === 'move' ? 'Make a move' : 'Respond to opponent'}</p>
        <p className="text-xs sm:text-sm">Player 1 is on: {board[player1Position.row]?.[player1Position.col]} | Player 2 is on: {board[player2Position.row]?.[player2Position.col]}</p>
        
        {gamePhase === 'response' && validMoves.length === 0 && !gameOver && (
          <div>
            <p className="text-red-500 font-bold mt-1 sm:mt-2 text-sm">No valid response moves available! Turn will automatically pass...</p>
          </div>
        )}
        
        {gameOver && (
          <button 
            onClick={resetGame}
            className="mt-2 sm:mt-4 px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded text-sm sm:text-base"
          >
            Play Again
          </button>
        )}
      </div>
      
      {/* Responsive game board */}
      <div className="border-2 border-gray-300 rounded overflow-hidden max-w-full">
        <div className="grid-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => {
                const isPlayer1 = player1Position.row === rowIndex && player1Position.col === colIndex;
                const isPlayer2 = player2Position.row === rowIndex && player2Position.col === colIndex;
                const isCorner = 
                  (rowIndex === 0 && colIndex === 0) || 
                  (rowIndex === 9 && colIndex === 9);
                const isValidMove = isCellValidMove(rowIndex, colIndex);
                
                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`} 
                    className={`
                      ${getCellSize()} flex items-center justify-center relative cursor-pointer
                      ${isValidMove && !gameOver ? 'bg-green-100' : isCorner ? 'bg-yellow-100' : ''}
                      ${isPlayer1 && isPlayer2 ? 'border-4 border-purple-500' : 
                        isPlayer1 ? 'border-2 border-blue-500' : 
                        isPlayer2 ? 'border-2 border-red-500' : 
                        'border border-gray-200'}
                    `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    <span className={`${isPlayer1 || isPlayer2 ? 'font-bold' : ''} text-xs sm:text-sm`}>{cell}</span>
                    {isPlayer1 && isPlayer2 && (
                      <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                    )}
                    {isPlayer1 && isPlayer2 && (
                      <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Collapsible rules section for mobile */}
      <div className="mt-2 sm:mt-4 w-full px-2">
        <button 
          onClick={toggleRules} 
          className="text-sm sm:text-base w-full py-1 bg-blue-100 rounded mb-1"
        >
          {showRules ? "Hide Rules" : "Show Rules"}
        </button>
        
        {showRules && (
          <div className="text-xs sm:text-sm">
            <p><strong>Rules:</strong></p>
            <ul className="list-disc pl-4 sm:pl-6">
              <li>Player 1 starts at top-left, Player 2 starts at bottom-right</li>
              <li>On your turn, click on any neighboring cell to move there</li>
              <li>Your opponent must then move to a cell that matches the comparison (greater, equal, or less) from your move</li>
              <li>If your opponent has no valid moves, they lose their turn completely</li>
              <li>After responding, it's your opponent's turn to move</li>
              <li>First player to reach the opposite corner wins</li>
            </ul>
            <p className="text-xxs sm:text-xs text-gray-500 mt-2 sm:mt-4 text-center">Icons made by <a href="https://www.flaticon.com/authors/juicy_fish" title="juicy_fish">juicy_fish</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberMazeGame;