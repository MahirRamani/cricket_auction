import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Team {
  _id: string
  name: string
}

interface Player {
  _id: string
  name: string
  rollNumber: string
  rating: number
  team: string
  soldPrice: number
  basePrice: number
  isSold: boolean
  round: number
}

interface AuctionInterfaceProps {
  filter: number[]
}

export default function AuctionInterface({ filter }: AuctionInterfaceProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRound, setSelectedRound] = useState<number>(1)
  const [error, setError] = useState("")
  const [recentlySold, setRecentlySold] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes] = await Promise.all([fetch("/api/players"), fetch("/api/teams")])

      if (playersRes.ok && teamsRes.ok) {
        const [playersData, teamsData] = await Promise.all([playersRes.json(), teamsRes.json()])
        const playersWithBasePrice = playersData
          .filter((player: Player) => player.rating !== 5)
          .map((player: Player) => ({
            ...player,
            basePrice: player.basePrice || 1000,
            soldPrice: player.soldPrice || player.basePrice || 1000
          }))
        setPlayers(playersWithBasePrice)
        setTeams(teamsData)
      } else {
        setError("Failed to fetch data")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleTeamChange = async (playerId: string, teamName: string) => {
    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: teamName }),
      })

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => (player._id === playerId ? { ...player, team: teamName } : player)),
        )
        toast({
          title: "Success",
          description: "Team updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update team",
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

  const handlePriceChange = async (playerId: string, price: number) => {
    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soldPrice: price }),
      })

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => (player._id === playerId ? { ...player, soldPrice: price } : player)),
        )
        toast({
          title: "Success",
          description: "Price updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update price",
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

  const handleSold = async (playerId: string, teamName: string, price: number) => {
    if (!teamName) {
      toast({
        title: "Error",
        description: "Please select a team first",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`/api/players/${playerId}/sold`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: teamName, soldPrice: price }),
      })

      if (res.ok) {
        setRecentlySold(playerId)
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === playerId ? { ...player, isSold: true, team: teamName, soldPrice: price } : player,
          ),
        )
        toast({
          title: "Success",
          description: "Player marked as sold",
        })
        setTimeout(() => setRecentlySold(null), 1000)
      } else {
        toast({
          title: "Error",
          description: "Failed to mark player as sold",
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

  const getTeamName = (teamName: string | null) => {
    if (!teamName) return "N/A"
    const team = teams.find((t) => t.name === teamName)
    return team ? team.name : "- - -"
  }

  const filteredPlayers = players.filter(
    (player) =>
      player.round === selectedRound &&
      (filter.length === 0 || filter.includes(Math.floor(player.rating))) &&
      (searchQuery === "" ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Button onClick={fetchData}>Refresh Data</Button>
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <RadioGroup
          defaultValue="1"
          className="flex gap-4"
          onValueChange={(value) => setSelectedRound(parseInt(value))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="round1" />
            <Label htmlFor="round1">Round 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="round3" />
            <Label htmlFor="round3">Round 3</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <div key={player._id} className="border rounded-lg shadow-md overflow-hidden relative h-[300px]">
            <div className="flex h-full">
              <div className="w-1/2 relative">
                <Image
                  src={`https://keshav-cup.sirv.com/keshav-cup-2025/${player.rollNumber}.webp` || "/placeholder.svg"}
                  alt={player.name}
                  fill
                  className={`object-cover ${player.isSold ? "grayscale opacity-70" : ""}`}
                />
                {player.isSold && (
                  <div
                    className={`absolute top-60 left-40 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${recentlySold === player._id ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
                      }`}
                  >
                    <div className="absolute inset-0 animate-[pulse_3s_ease-in-out_infinite]">
      <div className="absolute inset-0 bg-white/30 blur-xl animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-white/20 blur-2xl animate-[pulse_3s_ease-in-out_infinite] delay-50" />
      <div className="absolute inset-0 bg-white/10 blur-3xl animate-[pulse_3s_ease-in-out_infinite] delay-100" />
    </div>
    <Image
      src="/Red-Sold-Out-Icon-PNG.png"
      alt="Sold"
      width={200}
      height={200}
      className="rotate-[-15deg] relative z-10 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]"
    />
                  </div>
                )}
              </div>
              <div className="w-1/2 p-4 space-y-3 bg-white">
                <h2 className="text-xl font-semibold truncate">{player.name}</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Team: {getTeamName(player.team)}</p>
                  </div>

                  <select
                    value={player.team || ""}
                    onChange={(e) => handleTeamChange(player._id, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>

                  <div>
                    <p className="text-sm text-gray-600">Price:</p>
                    <input
                      type="number"
                      value={player.soldPrice}
                      onChange={(e) => handlePriceChange(player._id, Number(e.target.value))}
                      className="w-full p-2 border rounded"
                      placeholder={`Base Price: ₹${player.basePrice}`}
                    />
                  </div>

                  {!player.isSold && (
                    <Button
                      onClick={() => handleSold(player._id, player.team, player.soldPrice)}
                      className="w-full"
                      disabled={!player.team}
                    >
                      Mark as Sold
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

