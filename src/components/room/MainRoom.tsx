import React, { useState } from 'react'
import SketchBoard from '../board/SketchBoard'
import SketchGuesser from '../sketchGuesser/SketchGuesser'
import PlayersList from '../player/PlayersList'
const MainRoom = () => {
  const [started, setStarted] = useState(false)
  const handleStartGame = () => {
    setStarted(true)
    // Update database
    // Socket
  }

  return (
    <>
      {
        !started && <button onClick={handleStartGame}> Start Game</button>
      }      
      <SketchBoard />
      <SketchGuesser />
      <PlayersList />
    </>
  )
}

export default MainRoom