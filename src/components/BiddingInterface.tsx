"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

const SoldOverlay = ({ className = "" }) => (
  <div className={`absolute top-1/2 right-0 ${className}`}>
    <motion.div
      initial={{ scale: 2, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 40
      }}
    >
      <Image
        src="/Red-Sold-Out-Icon-PNG.png"
        alt="Sold"
        width={80}
        height={80}
        className="object-contain"
      />
    </motion.div>
  </div>
)

// Rest of the interfaces remain the same
interface Team {
  _id: string
  name: string
}

interface Player {
  basePrice: number
  isCricketChosen: boolean
  _id: string
  name: string
  rollNumber: string
  imageUrl: string
  rating: number
  team: string | null
  soldPrice: number
  isSold: boolean
}

export default function BiddingInterface() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [tempTeam, setTempTeam] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "full">("grid")

  // Fetch data function remains the same
  const fetchData = async () => {
    setLoading(true)
    try {
      const [playersRes, teamsRes] = await Promise.all([
        fetch("/api/players?rating=5"),
        fetch("/api/teams")
      ])

      if (playersRes.ok && teamsRes.ok) {
        const [playersData, teamsData] = await Promise.all([
          playersRes.json(),
          teamsRes.json()
        ])

        const filteredPlayers = playersData
          .filter((player: Player) => player.rating === 5 && player.isCricketChosen)
          .map((player: Player) => ({
            ...player,
            basePrice: player.basePrice || 1000,
            soldPrice: player.soldPrice || player.basePrice || 1000,
          }))

        setPlayers(filteredPlayers)
        console.log("filteredPlayers", filteredPlayers)
        setTeams(teamsData)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTeamChange = (teamName: string) => {
    setTempTeam(teamName)
  }

  const handlePriceChange = (price: number) => {
    setTempPrice(price)
  }

  const handleSold = async () => {
    if (!selectedPlayer || !tempTeam || !tempPrice || tempPrice <= 0) return

    try {
      const res = await fetch(`/api/players/${selectedPlayer._id}/sold`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: tempTeam, soldPrice: tempPrice }),
      })

      if (res.ok) {
        const updatedPlayer = await res.json()
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === updatedPlayer._id ? updatedPlayer : player
          )
        )
        setSelectedPlayer(updatedPlayer)
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

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (viewMode === "full" && selectedPlayer) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          onClick={() => {
            setViewMode("grid")
            setTempTeam(null)
            setTempPrice(null)
          }}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-xl p-8 relative max-w-4xl mx-auto">
          <div className="relative w-64 h-64">
            <Image
              src={`https://keshav-cup.sirv.com/keshav-cup-2025/${selectedPlayer.rollNumber}.webp` || "/placeholder.svg"}
              alt={selectedPlayer.name}
              fill
              className={`object-cover rounded-lg ${selectedPlayer.isSold ? "grayscale" : ""}`}
            />
            <AnimatePresence>
              {selectedPlayer.isSold && <SoldOverlay />}
            </AnimatePresence>
          </div>

          <h2 className="text-3xl font-bold text-center my-6">{selectedPlayer.name}</h2>

          <div className="w-full max-w-md space-y-4">
            <div className="flex space-x-2">
              <select
                value={tempTeam || ""}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="w-1/2 p-2 border rounded"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={tempPrice || ""}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-1/2 p-2 border rounded"
                placeholder="Price"
              />
            </div>

            {!selectedPlayer.isSold && tempTeam && tempPrice && (tempPrice > 0) && (
              <Button onClick={handleSold} className="w-full bg-green-500 hover:bg-green-600">
                Mark as Sold
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <div
            key={player._id}
            className="flex border p-4 rounded-lg shadow-md cursor-pointer relative hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedPlayer(player)
              setTempTeam(player.team)
              setTempPrice(player.soldPrice)
              setViewMode("full")
            }}
          >
            <div className="relative w-32 h-32">
              <Image
                src={`https://keshav-cup.sirv.com/keshav-cup-2025/${player.rollNumber}.webp` || "/placeholder.svg"}
                alt={player.name}
                fill
                className={`object-cover rounded-lg ${player.isSold ? "grayscale opacity-60" : ""}`}
              />
              <AnimatePresence>
                {player.isSold && <SoldOverlay className="scale-75" />}
              </AnimatePresence>
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <h3 className="font-semibold text-lg">{player.name}</h3>
              <p className="text-gray-600">Team: {player.team || '- - -'}</p>
              <p className="text-gray-600">Price: {player.soldPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

