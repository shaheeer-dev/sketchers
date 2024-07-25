import RoomPage from '@/components/room/RoomPage'
import db from '@/utils/PrismaClient'
import { redirect } from 'next/navigation'

const page = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params

  const room = await db.room.findUnique({ where: { id: roomId }, include: { players: { orderBy: { id: 'asc' } } }})


  if (!room) {
    redirect('/')
  }

  return (
    <RoomPage room={room} players={room.players}/>
  )
}

export default page