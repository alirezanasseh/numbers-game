import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NumberMazeGame from '../App';

// Mock Math.random for deterministic board generation
const mockMathRandom = vi.spyOn(Math, 'random');

describe('Game Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMathRandom.mockReturnValue(0.5); // All cells will have value 51
  });
  
  it('initializes player positions correctly', () => {
    const { container } = render(<NumberMazeGame />);
    
    // Find player markers in the grid
    // Player 1 should be at top-left (0,0)
    // Player 2 should be at bottom-right (9,9)
    
    // Check for player 1's border in the first cell
    const firstRow = container.querySelector('.grid-board > div:first-child');
    const firstCell = firstRow?.querySelector('div:first-child');
    expect(firstCell?.classList.contains('border-blue-500')).toBeTruthy();
    
    // Check for player 2's border in the last cell
    const lastRow = container.querySelector('.grid-board > div:last-child');
    const lastCell = lastRow?.querySelector('div:last-child');
    expect(lastCell?.classList.contains('border-red-500')).toBeTruthy();
  });
  
  it('displays player positions with their current values', () => {
    render(<NumberMazeGame />);
    
    // With our mock, all values are 51
    // We should see this text: "Player 1 is on: 51 | Player 2 is on: 51"
    const statusText = screen.getByText(/Player 1 is on: 51 \| Player 2 is on: 51/);
    expect(statusText).toBeInTheDocument();
  });
});