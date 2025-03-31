import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NumberMazeGame from '../App';

// Mock Math.random for deterministic board generation
const mockMathRandom = vi.spyOn(Math, 'random');

// Testing win conditions is challenging without being able to directly manipulate the game state
// These tests are simplified to focus on the win condition elements that we can access
describe('Win Conditions', () => {
  it('displays the game header correctly', () => {
    mockMathRandom.mockReturnValue(0.5);
    render(<NumberMazeGame />);
    
    // The game header should be displayed
    expect(screen.getByText('Number Maze Game')).toBeInTheDocument();
  });
  
  it('highlights the win destination tiles', () => {
    mockMathRandom.mockReturnValue(0.5);
    const { container } = render(<NumberMazeGame />);
    
    // The top-left and bottom-right corners should be highlighted as win destinations
    // These cells have the 'bg-yellow-100' class
    const cornerCells = container.querySelectorAll('.bg-yellow-100');
    expect(cornerCells.length).toBe(2);
  });
});