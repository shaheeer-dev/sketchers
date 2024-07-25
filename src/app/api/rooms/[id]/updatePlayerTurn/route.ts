import db from '@/utils/PrismaClient'
import { Player } from '@prisma/client'
import { request } from 'http'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (request: NextRequest, { params }: {params: { id: string }}) => {
  const { id } = params

  const room = await db.room.findUniqueOrThrow({ where: { id: id }, include: { players: { orderBy: { id: 'asc' } } }})
  const players = room.players as Player[]

  const currentPlayerIndex = players?.findIndex(player => player.id === room.currentPlayerId)
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
  const nextPlayer = players[nextPlayerIndex]

  await db.room.update({ where: { id: id }, data: { currentPlayerId: nextPlayer.id } })

  return NextResponse.json({currentPlayer: nextPlayer}, {status: 200})
}


