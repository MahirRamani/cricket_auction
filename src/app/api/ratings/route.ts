import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Rating from '@/models/Rating';
import Player from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  console.log("session", session);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ratings } = await req.json();

  try {
    console.log("user id", session.user._id);

    const voter = await Player.findById(session.user._id);
    if (!voter) {
      return NextResponse.json({ error: 'Voter not found' }, { status: 404 });
    }
    if (voter.hasVoted) {
      return NextResponse.json({ error: 'You have already voted' }, { status: 400 });
    }

    // if (ratings.length < 30) {
    //   return NextResponse.json({ error: 'You must rate at least 30 players' }, { status: 400 });
    // }

    // const fiveStarCount = ratings.filter((r: any) => r.rating === 5).length;
    // const oneStarCount = ratings.filter((r: any) => r.rating === 1).length;

    // if (fiveStarCount > 10 || oneStarCount > 1) {
    //   return NextResponse.json({ error: 'Invalid rating distribution' }, { status: 400 });
    // }

    // await Rating.insertMany(ratings.map((r: any) => ({ ...r, voterId: session.user._id })));
    await Player.updateMany(
      { _id: { $in: ratings.map((r: any) => r.playerId) } },
      { $inc: { rating: 1, votesReceived: 1 } }
    );
    // await Player.findByIdAndUpdate(, { hasVoted: true });

    console.log("ratings", ratings);

    return NextResponse.json({ message: 'Ratings submitted successfully' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

