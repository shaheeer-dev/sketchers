import { Player } from "@prisma/client";
import { useState, useEffect } from "react";

const useUserCheck = () => {
  const [userExists, setUserExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    try {
      const player = JSON.parse(localStorage.getItem('player') || '');

      if(player) {
        setUserExists(true);
        setPlayer(player);
      }
    } catch (error) {
      console.error('Error parsing player from local storage:', error);
    }
    
    setLoading(false);
  }, [])

  return { userExists, loading, setUserExists, player };
}

export default useUserCheck;