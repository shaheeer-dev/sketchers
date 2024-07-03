import db from '@/utils/PrismaClient'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/players, to get all users
export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params
  const room = await db.room.findUnique({ where: { id: id }, include: { players: true } })
  
  return NextResponse.json({room}, {status: 200})
}
