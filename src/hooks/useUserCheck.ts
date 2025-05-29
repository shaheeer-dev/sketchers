import { Player } from '@prisma/client'
import { useState, useEffect } from 'react'

const useUserCheck = (roomId?: string) => {
  const [userExists, setUserExists] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [player, setPlayer] = useState<Player>({
    id: 0,
    name: '',
    roomId: '',
    score: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  useEffect(() => {
    try {
      const storedPlayer = JSON.parse(localStorage.getItem('player') || '')

      if (storedPlayer && (!roomId || storedPlayer.roomId === roomId)) {
        setUserExists(true)
        setPlayer(storedPlayer)
      }
    } catch (error) {
      console.error('Error parsing player from local storage:', error)
    }

    setLoading(false)
  }, [])

  return { userExists, loading, setUserExists, player }
}

export default useUserCheck
