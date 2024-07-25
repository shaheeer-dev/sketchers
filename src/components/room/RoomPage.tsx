'use client'
import useUserCheck from '@/hooks/useUserCheck'
import MainRoom from '@/components/room/MainRoom'
import PlayerForm from '@/components/player/PlayerForm'
import { Player, Room } from '@prisma/client'

const RoomPage = ({ room, players }: { room: Room, players: Player[] }) => {
  const { userExists, loading, setUserExists } = useUserCheck()
  
  if(loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      { 
        userExists ? 
          <MainRoom room={room} players={players}/> 
          : 
          <PlayerForm  roomId={room.id} setPlayer={setUserExists}/> }
    </>
  )
}

export default RoomPage