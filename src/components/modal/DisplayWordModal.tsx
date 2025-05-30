import { Player } from '@prisma/client'
import React from 'react'
import { createPortal } from 'react-dom'
const DisplayWordModal = ({isOpen, onClose, word, players, playerScores}: { isOpen: boolean, onClose: () => void, word: string, players: Player[], playerScores: Record<string, number>}) => {

  if(!isOpen) return null

  return (
    createPortal(
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center" onClick={onClose}>
        <div className="bg-white p-6 rounded-lg relative text-black" onClick={(e) => e.stopPropagation()}>
          {word}
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
            Close
          </button>
          <div className="mt-4">
            {players.map((player) => (
              <div key={player.id}>
                <h2>{player.name}</h2>
                <span>{playerScores[player.id]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>,
      document.getElementById('modal') as HTMLElement
    )
  )
}

export default DisplayWordModal
