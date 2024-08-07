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
  const [drawableWord, setDrawableWord] = useState<string>('')
  const [wordCount, setWordCount] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { player, setUserExists } = useUserCheck()
  const [ playersList, setPlayersList ] = useState(players)
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({})

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
    socket.on('scores', handleScores)


    return () => {
      socket.off('game-started', handleSetStarted)
      socket.off('timeout', handleTimeOut)
      socket.off('new-player-turn', handleCurrentPlayerTurn)
      socket.off('scores', handleScores)

    //   if (player) {
    //     window.removeEventListener('unload', handleWindowUnload)
    //   }
    }
  }, [player])

  const handleScores = (scores: Record<string, number>) => {
    setPlayerScores((prev) => {
      const newScores = { ...prev };
      Object.keys(scores).map((key) => newScores[key] = (newScores[key] || 0) + Number(scores[key]))
      return newScores;
    })
  }

  const handleCurrentPlayerTurn = (currentPlayerTurn: Player) => {
    if(players.length <= 1){
      setIsStarted(false)
      return
    }

    setCurrentTurnPlayerId(currentPlayerTurn.id)
    setIsModalOpen(false)
    setIsStarted(true)
    const playerName = getCurrentPlayerName(currentPlayerTurn.id)
   if (player.id === currentPlayerTurn.id) {
      const word = getWord();
      setDrawableWord(word)
      socket.emit('start-game', {wordToDraw: word, roomId: room.id, playerName: playerName, totalPlayers: playersList.length})
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
    socket.emit('start-game', {wordToDraw: word, roomId: room.id, playerName: playerName, totalPlayers: playersList.length })
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
          <PlayersList room={room} players={playersList} setPlayers={setPlayersList} setIsStarted={setIsStarted} currentPlayerId={currentTurnPlayerId} playerScores={playerScores}/>
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
          <Chat player={player} currentTurnPlayerId={currentTurnPlayerId}/>
        </div>
      </div>
      {        
        drawableWord &&
          <DisplayWordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} word={drawableWord}  players={playersList} playerScores={playerScores} />
      }
    </>
  )
}

export default MainRoom
