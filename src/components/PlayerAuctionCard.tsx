import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Player {
  _id: string
  name: string
  rollNumber: string
  rating: number
  team: string | null
  soldPrice: number
  basePrice: number
  isSold: boolean
  isCricketChosen: boolean
}

interface Team {
  _id: string
  name: string
}

interface PlayerCardProps {
  player: Player
  teams: Team[]
  onClose: () => void
  handleTeamChange: (playerId: string, teamId: string) => Promise<void>
  handlePriceChange: (playerId: string, price: number) => Promise<void>
  handleSold: (playerId: string, teamId: string, price: number) => Promise<void>
  getTeamName: (teamId: string | null) => string
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  teams,
  onClose,
  handleTeamChange,
  handlePriceChange,
  handleSold,
  getTeamName,
}) => {
  const [localPrice, setLocalPrice] = React.useState(player.soldPrice || player.basePrice)

  const handleLocalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number.parseInt(e.target.value, 10)
    if (!isNaN(newPrice) && newPrice >= 0) {
      setLocalPrice(newPrice)
    }
  }

  const handlePriceUpdate = () => {
    handlePriceChange(player._id, localPrice)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px]">
            <Image
              src={`https://keshav-cup.sirv.com/keshav-cup-2025/${player.rollNumber}.webp` || "/placeholder.svg"}
              alt={player.name}
              layout="fill"
              objectFit="cover"
              className={player.isSold ? "grayscale" : ""}
            />
            {player.isSold && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Image
                  src="/Red-Sold-Out-Icon-PNG.png"
                  alt="Sold"
                  width={200}
                  height={200}
                  className="rotate-[-15deg]"
                />
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 p-6 space-y-4 bg-white">
            <h2 className="text-3xl font-semibold">{player.name}</h2>
            <p className="text-xl">Roll Number: {player.rollNumber}</p>
            <div>
              <p className="text-lg font-medium">Current Team:</p>
              <p className="text-xl">{getTeamName(player.team)}</p>
            </div>
            <div>
              <label htmlFor="team-select" className="block text-sm font-medium text-gray-700">
                Select Team
              </label>
              <select
                id="team-select"
                value={player.team || ""}
                onChange={(e) => handleTeamChange(player._id, e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={player.isSold}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price-input" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <Input
                  type="number"
                  name="price"
                  id="price-input"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                  value={localPrice}
                  onChange={handleLocalPriceChange}
                  onBlur={handlePriceUpdate}
                  disabled={player.isSold}
                />
              </div>
            </div>
            {!player.isSold && (
              <Button
                onClick={() => handleSold(player._id, player.team!, localPrice)}
                className="w-full text-lg"
                disabled={!player.team}
              >
                Mark as Sold
              </Button>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-100">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
