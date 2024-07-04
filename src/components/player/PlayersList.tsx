'use client'
import React, { useEffect } from 'react'
import axios from 'axios'
import { socket } from '@/socket'
import { Player, Room } from '@prisma/client'
import useUserCheck from '@/hooks/useUserCheck'

const PlayersList = ({room}: {room: Room}) => {
  console.log('Room ->>>', room)
  const [players, setPlayers] = React.useState<Player[]>([])
  const [isPlayerListUpdated, setIsPlayerListUpdated] = React.useState(true)
  const { player: currentPlayer } = useUserCheck()

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
        <div key={player.id} className={`${ player.id === room.currentPlayerId ? 'bg-blue-500 text-white' : 'bg-gray-200' } p-2 rounded mb-2`}>{player.name} { currentPlayer?.id === player?.id ? '(You)' : '' }</div>
      )))}
    </div>
  )
}

export default PlayersList
