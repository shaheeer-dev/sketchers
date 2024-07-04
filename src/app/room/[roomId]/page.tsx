import RoomPage from '@/components/room/RoomPage'
import db from '@/utils/PrismaClient'
import { redirect } from 'next/navigation'

const page = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params

  const room = await db.room.findUnique({ where: { id: roomId } })

  if (!room) {
    redirect('/room')
  }

  return (
    <RoomPage room={room} />
  )
}

export default page