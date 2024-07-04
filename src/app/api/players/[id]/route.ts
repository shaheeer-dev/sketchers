import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/PrismaClient'

export const DELETE = async (request: NextRequest, { params }: { params: { id: string} }) => {
  const { id } = params
  
  if(!id) {
    return NextResponse.json({message: 'Player ID is required'}, {status: 400})
  }

  try {
    await db.player.delete({ where: { id: +id } })
    return NextResponse.json({message: 'Player deleted successfully'}, {status: 200})
  } catch (error) {
    return NextResponse.json({message: 'Error deleting player'}, {status: 500})
  }
  
}
