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

export const PUT = async (request: NextRequest, { params }: { params: { id: string} }) => {
  const { id } = params

  if(!id) {
    return NextResponse.json({message: 'Player ID is required'}, {status: 400})
  }

  const body = await request.json()
  const data = body.data

  if(!data || Object.keys(data).length === 0) {
    return NextResponse.json({message: 'No data provided to update'}, {status: 400})
  }

  try {
    await db.player.update({ where: { id: +id }, data: data })
    return NextResponse.json({message: 'Player updated successfully'}, {status: 200})
  } catch (error) {
    return NextResponse.json({message: 'Error updating player score'}, {status: 500})
  }
}
