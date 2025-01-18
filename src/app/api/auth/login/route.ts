import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();
  const { mobileNumber, password } = await req.json();

  try {
    const player = await Player.findOne({ mobileNumber });
    console.log("player", player);
    if (!player || player.hasVoted) {
      return NextResponse.json({ error: 'Invalid credentials or already voted' }, { status: 401 });
    }



    // const isMatch = await bcrypt.compare(password, player.password);
    const isMatch = password === player.password;
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return NextResponse.json({ token, player: { id: player._id, name: player.name, rollNumber: player.rollNumber } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

