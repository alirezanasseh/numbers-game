# Numbers Game Test Suite

This directory contains tests for the Numbers Maze Game project using Vitest and React Testing Library.

## Test Structure

The test suite is organized into several key areas:

1. **NumberMazeGame.test.tsx** - Tests the basic rendering and functionality of the main game component
2. **GameMechanics.test.tsx** - Tests game mechanics like valid moves and player turn transitions
3. **Utilities.test.tsx** - Tests utility functions and edge cases
4. **GameInitialization.test.tsx** - Tests game initialization and player positioning
5. **WinCondition.test.tsx** - Tests win condition elements and display

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

## Test Coverage

The current test suite covers:

- Basic component rendering
- Game rules display
- Valid moves highlighting
- Player position tracking
- Game state transitions
- Win condition elements

## Future Test Improvements

Areas for future test expansion:

1. **State Management Testing** - Tests for more complex state changes
2. **Complete User Flow Testing** - Tests for complete game scenarios
3. **Edge Case Coverage** - Tests for rare but important game situations
4. **Performance Testing** - Tests for rendering performance

## Test Utilities

The test suite uses several testing utilities:

- **Vitest** - Test runner and framework
- **React Testing Library** - For component rendering and interactions
- **@testing-library/jest-dom** - For enhanced DOM assertions
- **jsdom** - For simulating a browser environment

## Mocking Strategy

The tests use a consistent mocking strategy:

- `Math.random()` is mocked to generate predictable board values
- This ensures tests are deterministic and repeatable