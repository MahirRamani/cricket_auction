import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/User';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const player = await Player.findByIdAndUpdate(params.id, { isSold: true }, { new: true });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

