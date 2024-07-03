import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/PrismaClient'

export const DELETE = async (_: NextRequest, { params }: { params: { id: string} }) => {
  const { id } = params;
  await db.player.delete({ where: { id: +id } });
  
  return NextResponse.json({message: 'Player deleted successfully'}, {status: 200});
}
