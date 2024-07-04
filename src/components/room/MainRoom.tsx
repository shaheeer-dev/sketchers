'use client'
// components/MainRoom.tsx
import React, { useEffect, useState } from 'react'
import SketchBoard from '../board/SketchBoard'
import PlayersList from '../player/PlayersList'
import Chat from '../Chat/Chat'
import { socket } from '@/socket'
import { useParams, useRouter } from 'next/navigation'
import useUserCheck from '@/hooks/useUserCheck'
import { Room } from '@prisma/client'
import Countdown from 'react-countdown'

const MainRoom = ({ room }: { room: Room }) => {
  const [started, setStarted] = useState(false)
  const { player, setUserExists } = useUserCheck()

  const handleStartGame = () => {
    setStarted(true)
    // Update database
    // Socket
  }

  useEffect(() => {
    socket.emit('join-room', room.id)
  }, [])

  const router = useRouter()

  const handleLeaveGame = () => {
    socket.emit('leave-room', {player, roomId: room.id})
    setUserExists(false)
    localStorage.removeItem('player')
    localStorage.removeItem('playerName')
    router.push('/room')
  }

  return (
    <>
      <div>
        <Countdown date={Date.now() + 30000}/>
      </div>
      <div className="flex h-screen bg-gray-200">
        <div className="w-1/4 p-4">
          <PlayersList room={room}/>
        </div>
      
        <div className="flex-grow p-4">
          <SketchBoard  room={room}/>

          <div className='text-center'>
            {!started && (<>
              <button
                onClick={handleStartGame}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            Start Game
              </button>
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
          <Chat />
        </div>
      </div>
    </>
  )
}

export default MainRoom
