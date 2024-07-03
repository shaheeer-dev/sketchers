import { socket } from '@/socket'
import React from 'react'
import { useRouter } from 'next/navigation'

const JoinRoom = () => {
  const router = useRouter()

  const handleFormSubmit = (event: any) => {
    event.preventDefault()
    const roomId = event.target.roomId.value

    router.push(`/room/${roomId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg w-[50%]">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Join Room</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center w-full">
        <input
          type="text"
          name="roomId"
          placeholder="Room ID"
          className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-6 py-3 text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
        >
          Join
        </button>
      </form>
    </div>
  )
}

export default JoinRoom
