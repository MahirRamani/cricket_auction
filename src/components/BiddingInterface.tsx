"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface Player {
  _id: string
  name: string
  rollNumber: string
  imageUrl: string
  rating: number
  team: string | null
  soldPrice: number
  isSold: boolean
}

export function     BiddingInterface() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRandomPlayer()
  }, [])

  const fetchRandomPlayer = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/players/random?rating=5")
      if (res.ok) {
        const player = await res.json()
        setCurrentPlayer(player)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch player",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching player:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleSold = async () => {
    if (!currentPlayer) return

    try {
      const res = await fetch(`/api/players/${currentPlayer._id}/sold`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSold: true }),
      })

      if (res.ok) {
        setCurrentPlayer({ ...currentPlayer, isSold: true })
        toast({
          title: "Success",
          description: "Player marked as sold",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to mark player as sold",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking player as sold:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!currentPlayer) {
    return <div>No player available</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
        {currentPlayer.isSold && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-red-600 font-bold text-6xl transform rotate-[10deg] z-10">SOLD</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-600 font-bold text-2xl transform rotate-[10deg] mt-20 z-10">
                <svg viewBox="0 0 100 100" className="w-32 h-32">
                  <path id="curve" fill="transparent" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0" />
                  <text fontSize="16">
                    <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                      Sports Day 2000
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </>
        )}
        <div className="relative mb-6">
          <Image
            src={currentPlayer.imageUrl || "/placeholder.svg"}
            alt={currentPlayer.name}
            width={300}
            height={300}
            className="rounded-lg mx-auto"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">{currentPlayer.name}</h2>
        <p className="text-xl text-center mb-4">Roll Number: {currentPlayer.rollNumber}</p>
        <div className="flex justify-center space-x-4 mt-6">
          <Button onClick={fetchRandomPlayer} className="bg-blue-500 hover:bg-blue-600">
            Next Player
          </Button>
          <Button onClick={handleSold} disabled={currentPlayer.isSold} className="bg-green-500 hover:bg-green-600">
            Mark as Sold
          </Button>
        </div>
      </div>
    </div>
  )
}

