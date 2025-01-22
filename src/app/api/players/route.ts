import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/User';

export async function GET() {
  // await dbConnect();
  console.log("GET--------------------------------------------------");
  

  try {
    const players = await Player.find({ isCricketChosen: true });
    // console.log(players);
    console.log("players");
    
    return NextResponse.json(players);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

