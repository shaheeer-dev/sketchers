import db from '@/utils/PrismaClient'
import { Player } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (request: NextRequest, { params }: {params: { id: string }}) => {
  const { id } = params

  if(!id) return NextResponse.json({message: 'Room ID is required'}, {status: 400})

  const room = await db.room.findUniqueOrThrow({ where: { id: id }, include: { players: { orderBy: { id: 'asc' } } }})
  const players = room?.players as Player[]

  const currentPlayerIndex = players?.findIndex(player => player.id === room.currentPlayerId)
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
  const nextPlayer = players[nextPlayerIndex]

  try {
    await db.room.update({ where: { id: id }, data: { currentPlayerId: nextPlayer.id } })
    return NextResponse.json({currentPlayer: nextPlayer}, {status: 200})
  } catch(error) {
    return NextResponse.json({message: 'Something went wrong! unable to change player turn'}, {status: 500})
  }
}

