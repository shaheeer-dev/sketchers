import { NextResponse } from 'next/server'
import db from '@/utils/PrismaClient'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const room = await db.room.findUnique({
      where: { id },
      include: { players: { orderBy: { id: 'asc' } } },
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 },
    )
  }
}
