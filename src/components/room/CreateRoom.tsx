import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import JoinRoom from './JoinRoom'

const CreateRoom = () => {
  const router = useRouter()

  const createRoom = async () => {
    const response = await axios.post('/api/rooms')
    const roomId = response.data.roomId

    router.push(`/room/${roomId}`)
  }
  return (
    <>
      <button onClick={createRoom}>Create Room</button>
      <JoinRoom />
    </>
  )
}

export default CreateRoom