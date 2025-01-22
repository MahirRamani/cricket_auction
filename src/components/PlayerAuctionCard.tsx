import Image from "next/image"
import { Button } from "@/components/ui/button"

interface PlayerAuctionCardProps {
  player: {
    _id: string
    name: string
    rollNumber: string
    imageUrl: string
    team: string
    soldPrice: number
    isSold: boolean
  }
  teams: { _id: string; name: string }[]
  onTeamChange: (playerId: string, teamId: string) => void
  onPriceChange: (playerId: string, price: number) => void
  onSold: (playerId: string, teamId: string, price: number) => void
}

export function PlayerAuctionCard({ player, teams, onTeamChange, onPriceChange, onSold }: PlayerAuctionCardProps) {
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
      <p>Team: {player.team}</p>
      <p>Price: ₹{player.soldPrice}</p>
      <div className="mt-4">
        <label className="block mb-2">
          Team:
          <select
            value={player.team || ""}
            onChange={(e) => onTeamChange(player._id, e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4">
        <label className="block mb-2">
          Price:
          <input
            type="number"
            value={player.soldPrice}
            onChange={(e) => onPriceChange(player._id, Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>
      {!player.isSold && (
        <Button onClick={() => onSold(player._id, player.team, player.soldPrice)} className="mt-4 w-full">
          Mark as Sold
        </Button>
      )}
      {player.isSold && <p className="mt-4 text-green-600">Sold</p>}
    </div>
  )
}

