import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/User';

export async function GET() {
  await dbConnect();

  try {
    const players = await Player.find({ isCricketChosen: true }).select('-password');
    console.log(players);

    return NextResponse.json(players);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

