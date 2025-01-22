import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { rating } = await req.json();
    const player = await User.findByIdAndUpdate(params.id, { rating }, { new: true });
    
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
