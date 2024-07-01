import db from '@/utils/PrismaClient'
import { NextRequest, NextResponse } from 'next/server';


// GET /api/players, to get all users
export const GET = async () => {
  const players = await db.player.findMany();

  return NextResponse.json(players);
}

// POST /api/players, to create a new user
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { name, roomId} = body;

  const player = await db.player.create({ data: { name, roomId } });


  return NextResponse.json({
    player: player,
    message: 'User created successfully'
  }, {status: 201});
}

