'use client'
import useUserCheck from '@/hooks/useUserCheck'
import MainRoom from '@/components/room/MainRoom'
import PlayerForm from '@/components/player/PlayerForm'
import { Room } from '@prisma/client'

const RoomPage = ({ room }: { room: Room }) => {
  const { userExists, loading, setUserExists } = useUserCheck()
  
  if(loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      { userExists ? <MainRoom room={room} /> : <PlayerForm  roomId={room.id} setPlayer={setUserExists}/> }
    </>
  )
}

export default RoomPage