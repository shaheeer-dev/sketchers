import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/PrismaClient'

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  const { name, roomId} = body

  const player = await db.player.create({ data: { name, roomId } })

  return NextResponse.json({
    player: player,
    message: 'User created successfully'
  }, {status: 201})
}

