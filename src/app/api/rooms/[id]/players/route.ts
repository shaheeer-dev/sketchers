import db from '@/utils/PrismaClient'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params

  if (!id) {
    return NextResponse.json({message: 'Room not found'}, {status: 404})
  }

  try {
    const room = await db.room.findUnique(
      { 
        where: { id }, 
        include: { players: true } 
      }
    )
    
    return NextResponse.json({room}, {status: 200})
  } catch (error) {
    return NextResponse.json({message: 'Error fetching room'}, {status: 500})
  }
}
