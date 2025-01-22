import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    const { team, soldPrice } = await req.json();

    const player = await User.findByIdAndUpdate(
      id,
      { isSold: true, team, soldPrice },
      { new: true }
    );

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
  // import User from '@/models/User';

  // export async function PATCH(req: Request, context: { params: { id: string } }) {
  //   // await dbConnect();

  //   try {
  //     // Awaiting the params object from the context
  //     const { id } = context.params;

  //     if (!id) {
  //       return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  //     }

  //     const { team, soldPrice } = await req.json();

  //     const player = await User.findByIdAndUpdate(
  //       id,
  //       { isSold: true, team, soldPrice },
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

// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();

//   try {
    
//     const id = params.id;
//     if (!id) {
//       return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
//     }
    
//     const { team, soldPrice } = await req.json();

//     const player = await User.findByIdAndUpdate(params.id, { isSold: true, team, soldPrice }, { new: true });

//     if (!player) {
//       return NextResponse.json({ error: 'Player not found' }, { status: 404 });
//     }

//     return NextResponse.json(player);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }




// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Player from '@/models/User';

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();

//   try {
//     // const a = await params;
//     const player = await Player.findByIdAndUpdate(await params.id, { isSold: true }, { new: true });

//     if (!player) {
//       return NextResponse.json({ error: 'Player not found' }, { status: 404 });
//     }

//     return NextResponse.json(player);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

