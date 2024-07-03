'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { socket } from '@/socket'
import { Player } from '@prisma/client'

const PlayersList = () => {
  const [players, setPlayers] = React.useState<any[]>([])
  const [isPlayerListUpdated, setIsPlayerListUpdated] = React.useState(true)
  const { roomId } = useParams()

  const handleNewPlayerJoined = () => {
    setIsPlayerListUpdated(true)
  }

  const handleRemovePlayer = async (player: Player) => {
    if(player){
      const response = await axios.delete(`/api/players/${player.id}`)
      setIsPlayerListUpdated(true)
    }
  }

  useEffect(() => {

    const fetchPlayers = async () => {
      const response = await axios.get(`/api/rooms/${roomId}/players`)
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

  }, [roomId, isPlayerListUpdated])

  return (
    <div className="h-full bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Players List</h2>

      {players && (players.map((player: any) => (
        <div key={player.id} className="bg-gray-100 p-2 rounded mb-2">{player.name}</div>
      )))}
    </div>
  )
}

export default PlayersList
