import RoomPage from '@/components/room/RoomPage'
import { redirect } from 'next/navigation'
import { getRoomById } from '@/../services/apiService'

const page = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params

  try {
    const response = await getRoomById(roomId)
    if (!response.data) {
      redirect('/')
    }

    const room = response.data

    return (
      <RoomPage room={room} players={room.players}/>
    )
  } catch (error) {
    console.error('Error fetching room:', error)
    redirect('/')
  }
}

export default page
