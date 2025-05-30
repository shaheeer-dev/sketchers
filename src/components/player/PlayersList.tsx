'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { socket } from '@/socket'
import { Player, Room } from '@prisma/client'
import useUserCheck from '@/hooks/useUserCheck'

const PlayersList = (props: {room: Room, players: Player[], setPlayers: React.Dispatch<React.SetStateAction<Player[]>>, setIsStarted: React.Dispatch<React.SetStateAction<boolean>>, playerScores: Record<string, number>, currentPlayerId: number}) => {
  const {room, players, setPlayers, setIsStarted, currentPlayerId, playerScores} = props
  const [isPlayerListUpdated, setIsPlayerListUpdated] = useState(true)
  const { player: currentPlayer } = useUserCheck(room.id)
  const handleNewPlayerJoined = () => {
    setIsPlayerListUpdated(true)
  }

  const handleRemovePlayer = async (player: Player) => {
    if(player){
      setIsPlayerListUpdated(true)
    }
  }

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await axios.get(`/api/rooms/${room.id}/players`)
      const data = response.data
      
      setPlayers(data.room.players)
      setIsPlayerListUpdated(false)
    }
    if (isPlayerListUpdated) fetchPlayers()
      
    socket.on('new-player-joined', handleNewPlayerJoined)
    socket.on('player-left', handleRemovePlayer)

    return () => {
      socket.off('new-player-joined', handleNewPlayerJoined)
      socket.off('player-left', handleRemovePlayer)
    }

  }, [room.id, isPlayerListUpdated])

  return (
    <div className="h-full bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Players List</h2>

      {players && (players.map((player) => (
        <div key={player.id} className={`${room.isStarted && player.id === currentPlayerId ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-2 rounded mb-2`}>
          {player.name} { currentPlayer?.id === player?.id ? '(You)' : '' }
          <span className="float-right">{playerScores[player.id]}</span>
        </div>
      )))}
    </div>
  )
}

export default PlayersList
