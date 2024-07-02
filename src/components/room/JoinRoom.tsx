import { socket } from '@/socket'
import React from 'react'
import { useRouter } from 'next/navigation'

const JoinRoom = () => {
  const router = useRouter()

  const  handleFormSubmit = (event: any) =>  {
    event.preventDefault()
    const roomId = event.target.roomId.value
    console.log('joining room', roomId)
    socket.emit('join-room', roomId)
    router.push(`/room/${roomId}`)
  }
  return (
    <>
      <div>JoinRoom</div>
      <form onSubmit={handleFormSubmit}>
        {/* <input type="text" name="name" placeholder="Player Name" /> */}
        <input type="text" name="roomId" placeholder="Room ID" />
        <button type="submit">Join</button>
      </form>
    </>
  )
}

export default JoinRoom