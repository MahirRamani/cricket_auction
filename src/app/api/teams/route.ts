import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Team from "@/models/Team"
import User from "@/models/User"

export async function GET() {
  await dbConnect()

  try {
    const teams = await Team.find({})
    const teamsWithPlayers = await Promise.all(
      teams.map(async (team) => {
        const players = await User.find({ team: team._id, isSold: true }).select("name soldPrice")
        return {
          _id: team._id,
          name: team.name,
          budget: team.budget,
          players: players.map((player) => ({ name: player.name, price: player.soldPrice })),
        }
      }),
    )
    return NextResponse.json(teamsWithPlayers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  await dbConnect()

  try {
    const { name, budget } = await req.json()
    const team = new Team({ name, budget })
    await team.save()
    return NextResponse.json(team)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


// working
// import { NextResponse } from "next/server"
// import dbConnect from "@/lib/dbConnect"
// import Team from "@/models/Team"
// import User from "@/models/User"

// export async function GET() {
//   await dbConnect()

//   try {
//     const teams = await Team.find({})
//     const teamsWithPlayers = await Promise.all(
//       teams.map(async (team) => {
//         const players = await User.find({ team: team._id, isSold: true }).select("name soldPrice")
//         return {
//           _id: team._id,
//           name: team.name,
//           budget: team.budget,
//           players: players.map((player) => ({ name: player.name, price: player.soldPrice })),
//         }
//       }),
//     )
//     return NextResponse.json(teamsWithPlayers)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: "Server error" }, { status: 500 })
//   }
// }

// export async function POST(req: Request) {
//   await dbConnect()

//   try {
//     const { name, budget } = await req.json()
//     const team = new Team({ name, budget })
//     await team.save()
//     return NextResponse.json(team)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: "Server error" }, { status: 500 })
//   }
// }




// import { NextResponse } from "next/server"
// import dbConnect from "@/lib/dbConnect"
// import Team from "@/models/Team"
// import User from "@/models/User"

// export async function GET() {
//   await dbConnect()

//   try {
//     const teams = await Team.find({})
//     const teamsWithPlayers = await Promise.all(
//       teams.map(async (team) => {
//         const players = await User.find({ team: team._id, isSold: true }).select("name soldPrice")
//         return {
//           _id: team._id,
//           name: team.name,
//           budget: team.budget,
//           players: players.map((player) => ({ name: player.name, price: player.soldPrice })),
//         }
//       }),
//     )
//     return NextResponse.json(teamsWithPlayers)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: "Server error" }, { status: 500 })
//   }
// }

// export async function POST(req: Request) {
//   await dbConnect()

//   try {
//     const { name, budget } = await req.json()
//     const team = new Team({ name, budget })
//     await team.save()
//     return NextResponse.json(team)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: "Server error" }, { status: 500 })
//   }
// }

