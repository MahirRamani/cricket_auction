"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import PlayerCard from "@/components/PlayerCard"

interface Team {
  _id: string
  name: string
}

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

export default function BiddingInterface() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [recentlySold, setRecentlySold] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [playersRes, teamsRes] = await Promise.all([fetch("/api/players"), fetch("/api/teams")])

      if (playersRes.ok && teamsRes.ok) {
        const [playersData, teamsData] = await Promise.all([playersRes.json(), teamsRes.json()])

        const filteredPlayers = playersData
          .filter((player: Player) => player.rating === 5 && player.isCricketChosen)
          .map((player: Player) => ({
            ...player,
            basePrice: player.basePrice || 1000,
            soldPrice: player.soldPrice || player.basePrice || 1000,
          }))

        setPlayers(filteredPlayers)
        setTeams(teamsData)
      } else {
        setError("Failed to fetch data")
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        })
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleTeamChange = async (playerId: string, teamId: string) => {
    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: teamId }),
      })

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => (player._id === playerId ? { ...player, team: teamId } : player)),
        )
        setSelectedPlayer((prevPlayer) =>
          prevPlayer && prevPlayer._id === playerId ? { ...prevPlayer, team: teamId } : prevPlayer,
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
    if (isNaN(price) || price < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

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
        setSelectedPlayer((prevPlayer) =>
          prevPlayer && prevPlayer._id === playerId ? { ...prevPlayer, soldPrice: price } : prevPlayer,
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

  const handleSold = async (playerId: string, teamId: string, price: number) => {
    if (!teamId) {
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
        body: JSON.stringify({ team: teamId, soldPrice: price }),
      })

      if (res.ok) {
        setRecentlySold(playerId)
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === playerId ? { ...player, isSold: true, team: teamId, soldPrice: price } : player,
          ),
        )
        setSelectedPlayer((prevPlayer) =>
          prevPlayer && prevPlayer._id === playerId
            ? { ...prevPlayer, isSold: true, team: teamId, soldPrice: price }
            : prevPlayer,
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

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return "N/A"
    const team = teams.find((t) => t._id === teamId)
    return team ? team.name : "Unknown Team"
  }

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player)
  }

  const filteredPlayers = players.filter(
    (player) =>
      searchQuery === "" ||
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex gap-4 items-center">
        <Button onClick={fetchData}>Refresh Data</Button>
        <Input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {selectedPlayer && (
        <PlayerCard
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          teams={teams}
          handleTeamChange={handleTeamChange}
          handlePriceChange={handlePriceChange}
          handleSold={handleSold}
          getTeamName={getTeamName}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <div
            key={player._id}
            className="border rounded-lg shadow-md overflow-hidden relative h-[300px] cursor-pointer"
            onClick={() => handlePlayerSelect(player)}
          >
            <div className="flex h-full">
              <div className="w-1/2 relative">
                <Image
                  src={`https://keshav-cup.sirv.com/keshav-cup-2025/${player.rollNumber}.webp` || "/placeholder.svg"}
                  alt={player.name}
                  layout="fill"
                  objectFit="cover"
                  className={player.isSold ? "grayscale" : ""}
                />
                {player.isSold && (
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                      recentlySold === player._id ? "scale-150 opacity-0" : "scale-100 opacity-100"
                    }`}
                  >
                    <Image
                      src="/Red-Sold-Out-Icon-PNG.png"
                      alt="Sold"
                      width={150}
                      height={150}
                      className="rotate-[-15deg]"
                    />
                  </div>
                )}
              </div>
              <div className="w-1/2 p-4 space-y-3 bg-white">
                <h2 className="text-xl font-semibold truncate">{player.name}</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Current Team:</p>
                    <p className="font-medium">{getTeamName(player.team)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price:</p>
                    <p className="font-medium">₹{player.soldPrice || player.basePrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


// import * as React from "react"
// import * as ToastPrimitives from "@radix-ui/react-toast"
// import { cva, type VariantProps } from "class-variance-authority"
// import { X } from "lucide-react"

// import { cn } from "@/lib/utils"

// const ToastProvider = ToastPrimitives.Provider

// const ToastViewport = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Viewport>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Viewport
//     ref={ref}
//     className={cn(
//       "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
//       className
//     )}
//     {...props}
//   />
// ))
// ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// const toastVariants = cva(
//   "data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
//   {
//     variants: {
//       variant: {
//         default: "bg-background border",
//         destructive:
//           "group destructive border-destructive bg-destructive text-destructive-foreground",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   }
// )

// const Toast = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Root>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
//     VariantProps<typeof toastVariants>
// >(({ className, variant, ...props }, ref) => {
//   return (
//     <ToastPrimitives.Root
//       ref={ref}
//       className={cn(toastVariants({ variant }), className)}
//       {...props}
//     />
//   )
// })
// Toast.displayName = ToastPrimitives.Root.displayName

// const ToastAction = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Action>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Action
//     ref={ref}
//     className={cn(
//       "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
//       className
//     )}
//     {...props}
//   />
// ))
// ToastAction.displayName = ToastPrimitives.Action.displayName

// const ToastClose = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Close>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Close
//     ref={ref}
//     className={cn(
//       "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
//       className
//     )}
//     toast-close=""
//     {...props}
//   >
//     <X className="h-4 w-4" />
//   </ToastPrimitives.Close>
// ))
// ToastClose.displayName = ToastPrimitives.Close.displayName

// const ToastTitle = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Title>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Title
//     ref={ref}
//     className={cn("text-sm font-semibold", className)}
//     {...props}
//   />
// ))
// ToastTitle.displayName = ToastPrimitives.Title.displayName

// const ToastDescription = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Description>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Description
//     ref={ref}
//     className={cn("text-sm opacity-90", className)}
//     {...props}
//   />
// ))
// ToastDescription.displayName = ToastPrimitives.Description.displayName

// type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

// type ToastActionElement = React.ReactElement<typeof ToastAction>

// export {
//   type ToastProps,
//   type ToastActionElement,
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose,
//   ToastAction,
// }
