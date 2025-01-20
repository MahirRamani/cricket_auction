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


// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Player from '@/models/User';

// export async function PATCH(
//   req: Request,
//   context: { params: { id: string } }
// ) {
//   const id = context.params.id;
//   if (!id) {
//     return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
//   }

//   await dbConnect();

//   try {
//     const { averageRating } = await req.json();
//     const player = await Player.findByIdAndUpdate(
//       id,
//       { averageRating },
//       { new: true }
//     );

//     if (!player) {
//       return NextResponse.json({ error: 'Player not found' }, { status: 404 });
//     }

//     return NextResponse.json(player);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

