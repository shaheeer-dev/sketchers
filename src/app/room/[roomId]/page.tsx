'use client'
import React, { useEffect } from 'react'
import useUserCheck from '@/hooks/useUserCheck'
import MainRoom from '@/components/room/MainRoom'
import PlayerForm from '@/components/player/PlayerForm'
import { useParams } from 'next/navigation'
import { socket } from '@/socket'

const page = () => {
  const { userExists, loading, setUserExists } = useUserCheck();
  const { roomId } = useParams()
  
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

export default page