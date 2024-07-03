// components/Chat.tsx
import React, { useEffect, useState } from 'react'
import { socket } from '@/socket'
import { useParams } from 'next/navigation'

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState<string>('')
  const { roomId }: { roomId: string } = useParams()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit('send-message', { input, roomId })
    setMessages((prevMessages) => [...prevMessages, input])
    setInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const updateMessages = (message: { input: string; roomId: string }) => {
    setMessages((prevMessages) => [...prevMessages, message.input])
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
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs break-words">
              {message}
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
