'use client'
import React, { useEffect, useState } from 'react'
import SketchBoard from '../board/SketchBoard'
import PlayersList from '../player/PlayersList'
import Chat from '../Chat/Chat'
import { socket } from '@/socket'
import { useRouter } from 'next/navigation'
import useUserCheck from '@/hooks/useUserCheck'
import { Player, Room } from '@prisma/client'
import Countdown from '@/components/countDown/Countdown'
import { getWord } from '@/utils/drawableWords'
import DisplayWordModal from '@/components/modal/DisplayWordModal'

const MainRoom = ({ room, players }: { room: Room, players: Player[] }) => {
  const [isStarted, setIsStarted] = useState(false)
  console.log('isStarted', isStarted)
  const [drawableWord, setDrawableWord] = useState<string>('')
  const [wordCount, setWordCount] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { player, setUserExists } = useUserCheck()
  const [ playersList, setPlayersList ] = useState(players)

  const [currentTurnPlayerName, setCurrentTurnPlayerName] = useState('')
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(room.currentPlayerId)

  const router = useRouter()

  const canStartGame = playersList.length > 1 && room.roomOwnerId === player.id
  const isCountdownStarted = player.id === currentTurnPlayerId && isStarted

  useEffect(() => {
    if (player) {
      socket.emit('join-room', room.id)
      // window.addEventListener('unload', handleWindowUnload)
    }
    socket.on('game-started', handleSetStarted)
    socket.on('timeout', handleTimeOut)
    socket.on('new-player-turn', handleCurrentPlayerTurn)

    return () => {
      socket.off('game-started', handleSetStarted)
      socket.off('timeout', handleTimeOut)
      socket.off('new-player-turn', handleCurrentPlayerTurn)
      
      if(currentTurnPlayerId === player.id)
        socket.emit('time-up', { roomId: room.id })
    //   if (player) {
    //     window.removeEventListener('unload', handleWindowUnload)
    //   }
    }
  }, [player])

  const handleCurrentPlayerTurn = (currentPlayerTurn: Player) => {
    if(players.length <= 1){
      setIsStarted(false)
      return
    }

    console.log(`current player turn`, currentPlayerTurn)
    // debugger
    setCurrentTurnPlayerId(currentPlayerTurn.id)
    setIsModalOpen(false)
    setIsStarted(true)
    const playerName = getCurrentPlayerName(currentPlayerTurn.id)
   if (player.id === currentPlayerTurn.id) {
      const word = getWord();
      setDrawableWord(word)
      socket.emit('start-game', {wordToDraw: word, roomId: room.id, playerName: playerName})
   }
  }
  const handleSetStarted = ({ wordCount: wC, playerName }: { wordCount: number, playerName: string }) => {
    setIsStarted(true)
    setWordCount(wC)
    setCurrentTurnPlayerName(playerName)
  }

  const handleTimeOut = (word: string) => {
    setIsStarted(false)
    setIsModalOpen(true)
    setDrawableWord(word)
  }

  const handleWindowUnload = () => processLeaveRoom()

  const handleStartGame = () => {
    setIsStarted(true)
    const word = getWord();
    setDrawableWord(word)
    const playerName = getCurrentPlayerName(currentTurnPlayerId)
    socket.emit('start-game', {wordToDraw: word, roomId: room.id, playerName: playerName})
  }

  const getCurrentPlayerName = (playerId: number) => {
    const CurrentPlayer = playersList.find((p) => p.id === playerId)
    if (CurrentPlayer) {
      console.log('Current Player name', CurrentPlayer.name)
      setCurrentTurnPlayerName(CurrentPlayer.name)
    }
    return CurrentPlayer?.name
  }

  const handleLeaveGame = () => {
    setUserExists(false)
    processLeaveRoom()
    router.push('/')
  }

  const processLeaveRoom = async () => {
    socket.emit('leave-room', {player, roomId: room.id})
    localStorage.removeItem('player')
    localStorage.removeItem('playerName')

    // await axios.delete(`/api/players/${player.id}`)
  }

  return (
    <>
    {
      isStarted 
      &&
      <div>
        <div>
          <p>{currentTurnPlayerName} is drawing</p>
        </div>
        <div className='text-center'>
          <p>{ player.id !== currentTurnPlayerId ? new Array(wordCount).fill('_').join(' ') : drawableWord}</p>
            <Countdown 
              isCountdownStarted={isCountdownStarted} 
              roomId={room.id} 
              currentPlayerId={currentTurnPlayerId}
              countDownLimit={15}
              onTimeUp={() => handleTimeOut(drawableWord)} 
            />
        </div>
      </div> 
    }
      <div className="flex h-screen bg-gray-200">
        <div className="w-1/4 p-4">
          <PlayersList room={room} players={playersList} setPlayers={setPlayersList} setIsStarted={setIsStarted} currentPlayerId={currentTurnPlayerId}/>
        </div>

        <div className="flex-grow p-4 z-0">
          <SketchBoard  roomId={room.id} isStarted={isStarted} currentTurnPlayerId={currentTurnPlayerId}/>

          <div className='text-center'>

            { canStartGame && !isStarted && (
              <>
                <button
                  onClick={handleStartGame}
                  className="mt-4 px-4 py-2 bg-blue-500 focus:ring-blue-500 hover:bg-blue-600 text-white rounded-lg  focus:outline-none focus:ring-2"
                >
                  Start Game
                </button>
              </>
            )

            }
            {isStarted && (<>
              <button
                onClick={handleLeaveGame}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            Leave Game
              </button>
            </>
            )}
          </div>
        </div>
        <div className="w-1/4 p-4">
          <Chat player={player}/>
        </div>
      </div>
      {
        drawableWord &&
          <DisplayWordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} word={drawableWord} />
      }
    </>
  )
}

export default MainRoom
