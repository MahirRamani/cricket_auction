import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function GET(request: Request) {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const rating = searchParams.get("rating")

  try {
    const query = rating ? { rating: Number.parseInt(rating), isSold: false } : { isSold: false }
    const count = await User.countDocuments(query)
    const random = Math.floor(Math.random() * count)
    const player = await User.findOne(query).skip(random)

    if (!player) {
      return NextResponse.json({ error: "No players available" }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

