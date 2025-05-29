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
import { getRoomById } from '@/../services/apiService'

const MainRoom = ({ room: initialRoom, players: initialPlayers }: { room: Room, players: Player[] }) => {
  const [isStarted, setIsStarted] = useState(false)
  const [drawableWord, setDrawableWord] = useState<string>('')
  const [wordCount, setWordCount] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({})
  const [players, setPlayers] = useState(initialPlayers)
  const [room, setRoom] = useState(initialRoom)
  const { player, setUserExists } = useUserCheck(room.id)

  const [currentTurnPlayerName, setCurrentTurnPlayerName] = useState('')
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(room.currentPlayerId)

  const router = useRouter()

  useEffect(() => {
    const fetchLatestRoom = async () => {
      try {
        const response = await getRoomById(room.id)
        const latestRoom = response.data
        setRoom(latestRoom)
        setPlayers(latestRoom.players)
      } catch (error) {
        console.error('Error fetching room:', error)
      }
    }

    fetchLatestRoom()
  }, [])

  const canStartGame = players.length > 1 && room.roomOwnerId === player.id
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
      const newScores = { ...prev }
      Object.keys(scores).map((key) => newScores[key] = (newScores[key] || 0) + Number(scores[key]))
      return newScores
    })
  }

  const handleCurrentPlayerTurn = (currentPlayerTurn: Player) => {
    if(initialPlayers.length <= 1){
      setIsStarted(false)
      return
    }

    setCurrentTurnPlayerId(currentPlayerTurn.id)
    setIsModalOpen(false)
    setIsStarted(true)
    const playerName = getCurrentPlayerName(currentPlayerTurn.id)
    if (player.id === currentPlayerTurn.id) {
      const word = getWord()
      setDrawableWord(word)
      socket.emit('start-game', {wordToDraw: word, roomId: room.id, playerName: playerName, totalPlayers: players.length})
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
    const word = getWord()
    setDrawableWord(word)
    const playerName = getCurrentPlayerName(currentTurnPlayerId)
    socket.emit('start-game', {wordToDraw: word, roomId: room.id, playerName: playerName, totalPlayers: players.length })
  }

  const getCurrentPlayerName = (playerId: number) => {
    const CurrentPlayer = players.find((p) => p.id === playerId)
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
          <PlayersList room={room} players={players} setPlayers={setPlayers} setIsStarted={setIsStarted} currentPlayerId={currentTurnPlayerId} playerScores={playerScores}/>
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
          <DisplayWordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} word={drawableWord}  players={players} playerScores={playerScores} />
      }
    </>
  )
}

export default MainRoom
