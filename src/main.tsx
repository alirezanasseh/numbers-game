import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NumberMazeGame from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NumberMazeGame />
  </StrictMode>,
)
