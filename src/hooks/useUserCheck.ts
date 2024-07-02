import { useState, useEffect } from 'react'

const useUserCheck = () => {
  const [userExists, setUserExists] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const user = localStorage.getItem('player')

    if(user) {
      setUserExists(true)
    }
    setLoading(false)
  }, [])

  return { userExists, loading, setUserExists }
}

export default useUserCheck