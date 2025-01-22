"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { PlayerAdminRatingCard } from "@/components/PlayerAdminRatingCard"

interface Player {
  _id: string
  name: string
  rollNumber: string
  rating: number
  votesReceived: number
  imageUrl: string
}

export function AdminRatingInterface() {
  const [players, setPlayers] = useState<Player[]>([])
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<number[]>([])

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players")
      if (res.ok) {
        const data = await res.json()
        setPlayers(data)
      } else {
        setError("Failed to fetch players")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleRatingChange = async (playerId: string, newRating: number) => {
    try {
      const res = await fetch(`/api/players/${playerId}/rating`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating }),
      })

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => (player._id === playerId ? { ...player, rating: newRating } : player)),
        )
        toast({
          title: "Success",
          description: "Rating updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update rating",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFilterChange = (star: number) => {
    setFilter((prev) => (prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]))
  }

  return (
    <div>
      <div className="mb-4">
        Filter by stars:
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            onClick={() => handleFilterChange(star)}
            variant={filter.includes(star) ? "default" : "outline"}
            className="ml-2"
          >
            {star} ★
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players
          .filter((player) => filter.length === 0 || filter.includes(Math.floor(player.rating)))
          .map((player) => (
            <PlayerAdminRatingCard key={player._id} player={player} onRatingChange={handleRatingChange} />
          ))}
      </div>
    </div>
  )
}

