'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

const RoomInviteBar = () => {
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    const parts = pathname?.split('/')
    const id = parts?.[2] || ''
    setRoomId(id)
  }, [pathname])

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className="flex items-center bg-gray-100 p-4 rounded-xl mb-2">
      <div className="flex items-center bg-white rounded-lg px-3 py-2 w-full max-w-md">
        <span className="text-gray-500 text-sm mr-2">Room ID:</span>
        <input
          type="text"
          value={roomId}
          readOnly
          className="bg-transparent border-none text-sm flex-grow focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
        />
        <button onClick={copyRoomId} title="Copy Room ID">
          📋
        </button>
      </div>

      <button
        onClick={copyInviteLink}
        className="ml-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
      >
        Invite Friend
      </button>
    </div>
  )
}

export default RoomInviteBar
