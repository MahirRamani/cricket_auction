import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { updates } = await req.json();
    
    for (const update of updates) {
      await Player.findByIdAndUpdate(update.playerId, { rating: update.rating });
    }

    return NextResponse.json({ message: 'Ratings updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

