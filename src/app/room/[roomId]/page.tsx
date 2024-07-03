'use client'
import React, { useEffect } from 'react'
import useUserCheck from '@/hooks/useUserCheck'
import MainRoom from '@/components/room/MainRoom'
import PlayerForm from '@/components/player/PlayerForm'
import { useParams } from 'next/navigation'

const RoomShow = () => {
  const { userExists, loading, setUserExists } = useUserCheck()
  const { roomId }: { roomId: string } = useParams()
  
  if(loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      { userExists ? <MainRoom /> : <PlayerForm  roomId={roomId} setPlayer={setUserExists}/> }
    </>
  )
}

export default RoomShow