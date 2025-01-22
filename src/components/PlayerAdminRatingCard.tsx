import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PlayerAdminRatingCardProps {
  player: {
    _id: string
    name: string
    rollNumber: string
    rating: number
    imageUrl: string
    votesReceived: number
  }
  onRatingChange: (playerId: string, newRating: number) => void
}

export function PlayerAdminRatingCard({ player, onRatingChange }: PlayerAdminRatingCardProps) {
  const [editedRating, setEditedRating] = useState(player.rating)

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = Number.parseFloat(e.target.value)
    setEditedRating(newRating)
  }

  const handleSubmit = () => {
    onRatingChange(player._id, editedRating)
  }

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Image
        src={player.imageUrl || "/placeholder.svg"}
        alt={player.name}
        width={200}
        height={200}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h2 className="text-xl font-semibold">{player.name}</h2>
      <p>Roll Number: {player.rollNumber}</p>
      <p>Current Rating: {player.rating.toFixed(1)}</p>
      <p>Votes Received: {player.votesReceived}</p>
      <div className="mt-4">
        <label className="block mb-2">
          Edit Rating:
          <input
            type="number"
            value={editedRating}
            onChange={handleRatingChange}
            min="0"
            max="5"
            step="0.1"
            className="w-full px-2 py-1 border rounded"
          />
        </label>
      </div>
      <Button onClick={handleSubmit} className="mt-4 w-full">
        Update Rating
      </Button>
    </div>
  )
}

