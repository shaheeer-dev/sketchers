import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/PrismaClient'

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  const { name, roomId} = body

  const room = await db.room.findUnique({ where: { id: roomId } })
  if (!room) {
    return NextResponse.json({
      message: 'Room not found'
    }, {status: 404})
  }

  const player = await db.player.create({ data: { name, roomId } })

  if (!room.currentPlayerId) {
    console.log('setting player as current player')
    await db.room.update({ where: { id: roomId }, data: { currentPlayerId: player.id } })
  }

  return NextResponse.json({
    player: player,
    message: 'User created successfully'
  }, {status: 201})
}

