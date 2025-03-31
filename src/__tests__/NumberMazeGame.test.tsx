import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NumberMazeGame from '../App';

// Mock Math.random to return predictable values for the game board
const mockMathRandom = vi.spyOn(Math, 'random');
// This will make all Math.random() calls return 0.5, resulting in all cells having value 51
mockMathRandom.mockReturnValue(0.5);

describe('NumberMazeGame', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockMathRandom.mockReturnValue(0.5);
  });

  it('renders the game title', () => {
    render(<NumberMazeGame />);
    expect(screen.getByText('Number Maze Game')).toBeInTheDocument();
  });

  it('displays the initial game status correctly', () => {
    render(<NumberMazeGame />);
    expect(screen.getByText('Player 1: Select a neighbor cell to move to')).toBeInTheDocument();
    expect(screen.getByText(/Current Player: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Phase: Make a move/)).toBeInTheDocument();
  });

  it('shows rules when the "Show Rules" button is clicked', () => {
    render(<NumberMazeGame />);
    
    // Initially, rules should be hidden
    expect(screen.queryByText(/Player 1 starts at top-left/)).not.toBeInTheDocument();
    
    // Click the Show Rules button
    fireEvent.click(screen.getByText('Show Rules'));
    
    // Now rules should be visible
    expect(screen.getByText(/Player 1 starts at top-left/)).toBeInTheDocument();
    
    // Click Hide Rules
    fireEvent.click(screen.getByText('Hide Rules'));
    
    // Rules should be hidden again
    expect(screen.queryByText(/Player 1 starts at top-left/)).not.toBeInTheDocument();
  });

  it('initializes the game board with random numbers', () => {
    render(<NumberMazeGame />);
    
    // With our mock, all cells should have the value 51
    // The board is 10x10, so we should have 100 instances of the number 51
    const cells = screen.getAllByText('51');
    expect(cells.length).toBeGreaterThan(0);
  });
});