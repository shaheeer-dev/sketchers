import db from '@/utils/PrismaClient'
import { NextRequest, NextResponse } from 'next/server'


export const POST = async (request: NextRequest) => {
  try {
    const room = await db.room.create({ data: {} })
    return NextResponse.json({ roomId: room.id, message: 'Room created successfully' }, {status: 201})
  } catch (error: any) {
    return NextResponse.json({message: error.message}, {status: 500})
  }
}
