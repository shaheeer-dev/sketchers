// components/Chat.tsx
import React, { useEffect, useState } from 'react'
import { socket } from '@/socket'
import { useParams } from 'next/navigation'
import { Player } from '@prisma/client'

type MessageListProp = {
  username: string;
  message: string;
  playerId: number;
};

const Chat = ({ player }: { player: Player }) => {
  const [messageList, setMessageList] = useState<MessageListProp[]>([])
  const [input, setInput] = useState<string>('')
  const { roomId }: { roomId: string } = useParams()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit('send-message', { input, roomId, player })
    setMessageList((prevMessages) => [...prevMessages, {message: input, playerId: player.id, username: player.name} as MessageListProp])
    setInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const updateMessages = (message: { input: string; roomId: string, player: Player }) => {
    setMessageList((prevMessages) => [...prevMessages, {message: message.input, playerId: message.player.id, username: message.player.name}])
  }

  useEffect(() => {
    socket.on('receive-message', updateMessages)

    return () => {
      socket.off('receive-message', updateMessages)
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col flex-grow p-4 overflow-auto">
        {messageList.map((data, index) => (
          <div key={index} className="mb-2">
            <sub>
              {data.username}
            </sub>
            <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs break-words">
              {data.message}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit} className="flex p-4 border-t border-gray-300">
        <input
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="message"
          placeholder="Type your message"
          value={input}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
