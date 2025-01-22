"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
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
  imageUrl: string
  team: string | null
  soldPrice: number
  isSold: boolean
}

interface AuctionInterfaceProps {
  filter: number[]
}

export function AuctionInterface({ filter }: AuctionInterfaceProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes] = await Promise.all([fetch("/api/players"), fetch("/api/teams")])

      if (playersRes.ok && teamsRes.ok) {
        const [playersData, teamsData] = await Promise.all([playersRes.json(), teamsRes.json()])
        setPlayers(playersData)
        setTeams(teamsData)
      } else {
        setError("Failed to fetch data")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
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

  const handleSold = async (playerId: string, teamId: string, price: number) => {
    try {
      const res = await fetch(`/api/players/${playerId}/sold`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: teamId, soldPrice: price }),
      })

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === playerId ? { ...player, isSold: true, team: teamId, soldPrice: price } : player,
          ),
        )
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

  const filteredPlayers = players.filter((player) => filter.length === 0 || filter.includes(Math.floor(player.rating)))

  return (
    <div className="space-y-8">
      <Button onClick={fetchData}>Refresh Data</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlayers.map((player) => (
          <div key={player._id} className="border p-4 rounded-lg shadow-md relative">
            {player.isSold && (
              <div className="absolute -top-4 -right-4 w-24 h-24 overflow-hidden">
                <div className="bg-red-600 text-white text-xs font-bold text-center transform rotate-45 absolute top-5 right-[-25px] w-[120px]">
                  SOLD
                </div>
              </div>
            )}
            <div className="flex items-center mb-2">
              <Image
                src={player.imageUrl || "/placeholder.svg"}
                alt={player.name}
                width={50}
                height={50}
                className="rounded-full mr-2"
              />
              <h2 className="text-lg font-semibold">{player.name}</h2>
            </div>
            <div className="flex justify-between mb-2">
              <p>Team: {getTeamName(player.team)}</p>
              <p>Price: ₹{player.soldPrice}</p>
            </div>
            <div className="flex space-x-2 mb-2">
              <select
                value={player.team || ""}
                onChange={(e) => handleTeamChange(player._id, e.target.value)}
                className="w-1/2 p-2 border rounded"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={player.soldPrice}
                onChange={(e) => handlePriceChange(player._id, Number(e.target.value))}
                className="w-1/2 p-2 border rounded"
                placeholder="Price"
              />
            </div>
            {!player.isSold && (
              <Button onClick={() => handleSold(player._id, player.team!, player.soldPrice)} className="w-full">
                Mark as Sold
              </Button>
            )}
            {player.isSold && (
              <div className="text-center">
                <p className="text-green-600">Sold</p>
                <p className="text-sm text-gray-500">Sports Day 2000</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"
// import Image from "next/image"

// interface Team {
//   _id: string
//   name: string
// }

// interface Player {
//   _id: string
//   name: string
//   rollNumber: string
//   rating: number
//   imageUrl: string
//   team: string | null
//   soldPrice: number
//   isSold: boolean
// }

// interface AuctionInterfaceProps {
//   filter: number[]
// }

// export function AuctionInterface({ filter }: AuctionInterfaceProps) {
//   const [players, setPlayers] = useState<Player[]>([])
//   const [teams, setTeams] = useState<Team[]>([])
//   const [error, setError] = useState("")

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [playersRes, teamsRes] = await Promise.all([fetch("/api/players"), fetch("/api/teams")])

//       if (playersRes.ok && teamsRes.ok) {
//         const [playersData, teamsData] = await Promise.all([playersRes.json(), teamsRes.json()])
//         setPlayers(playersData)
//         setTeams(teamsData)
//       } else {
//         setError("Failed to fetch data")
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again.")
//     }
//   }

//   const handleTeamChange = async (playerId: string, teamId: string) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ team: teamId }),
//       })

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) => (player._id === playerId ? { ...player, team: teamId } : player)),
//         )
//         toast({
//           title: "Success",
//           description: "Team updated successfully",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update team",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handlePriceChange = async (playerId: string, price: number) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ soldPrice: price }),
//       })

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) => (player._id === playerId ? { ...player, soldPrice: price } : player)),
//         )
//         toast({
//           title: "Success",
//           description: "Price updated successfully",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update price",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSold = async (playerId: string, teamId: string, price: number) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}/sold`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ team: teamId, soldPrice: price }),
//       })

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) =>
//             player._id === playerId ? { ...player, isSold: true, team: teamId, soldPrice: price } : player,
//           ),
//         )
//         toast({
//           title: "Success",
//           description: "Player marked as sold",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to mark player as sold",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const getTeamName = (teamId: string | null) => {
//     if (!teamId) return "N/A"
//     const team = teams.find((t) => t._id === teamId)
//     return team ? team.name : "Unknown Team"
//   }

//   const filteredPlayers = players.filter((player) => filter.length === 0 || filter.includes(Math.floor(player.rating)))

//   return (
//     <div className="space-y-8">
//       <Button onClick={fetchData}>Refresh Data</Button>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {filteredPlayers.map((player) => (
//           <div key={player._id} className="border p-4 rounded-lg shadow-md">
//             <div className="flex items-center mb-2">
//               <Image
//                 src={player.imageUrl || "/placeholder.svg"}
//                 alt={player.name}
//                 width={50}
//                 height={50}
//                 className="rounded-full mr-2"
//               />
//               <h2 className="text-lg font-semibold">{player.name}</h2>
//             </div>
//             <div className="flex justify-between mb-2">
//               <p>Team: {getTeamName(player.team)}</p>
//               <p>Price: ₹{player.soldPrice}</p>
//             </div>
//             <div className="flex space-x-2 mb-2">
//               <select
//                 value={player.team || ""}
//                 onChange={(e) => handleTeamChange(player._id, e.target.value)}
//                 className="w-1/2 p-2 border rounded"
//               >
//                 <option value="">Select Team</option>
//                 {teams.map((team) => (
//                   <option key={team._id} value={team._id}>
//                     {team.name}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="number"
//                 value={player.soldPrice}
//                 onChange={(e) => handlePriceChange(player._id, Number(e.target.value))}
//                 className="w-1/2 p-2 border rounded"
//                 placeholder="Price"
//               />
//             </div>
//             {!player.isSold && (
//               <Button onClick={() => handleSold(player._id, player.team!, player.soldPrice)} className="w-full">
//                 Mark as Sold
//               </Button>
//             )}
//             {player.isSold && <p className="text-green-600 text-center">Sold</p>}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"
// import { PlayerCard } from "@/components/PlayerCard"

// interface Team {
//   _id: string
//   name: string
// }

// interface Player {
//   _id: string
//   name: string
//   rollNumber: string
//   rating: number
//   imageUrl: string
//   team: string | null
//   soldPrice: number
//   isSold: boolean
// }

// interface AuctionInterfaceProps {
//   filter: number[]
// }

// export function AuctionInterface({ filter }: AuctionInterfaceProps) {
//   const [players, setPlayers] = useState<Player[]>([])
//   const [teams, setTeams] = useState<Team[]>([])
//   const [error, setError] = useState("")

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [playersRes, teamsRes] = await Promise.all([fetch("/api/players"), fetch("/api/teams")])

//       if (playersRes.ok && teamsRes.ok) {
//         const [playersData, teamsData] = await Promise.all([playersRes.json(), teamsRes.json()])
//         setPlayers(playersData)
//         setTeams(teamsData)
//       } else {
//         setError("Failed to fetch data")
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again.")
//     }
//   }

//   const handleTeamChange = async (playerId: string, teamId: string) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ team: teamId }),
//       })

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) => (player._id === playerId ? { ...player, team: teamId } : player)),
//         )
//         toast({
//           title: "Success",
//           description: "Team updated successfully",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update team",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handlePriceChange = async (playerId: string, price: number) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ soldPrice: price }),
//       })

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) => (player._id === playerId ? { ...player, soldPrice: price } : player)),
//         )
//         toast({
//           title: "Success",
//           description: "Price updated successfully",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update price",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSold = async (playerId: string, teamId: string, price: number) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}/sold`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ team: teamId, soldPrice: price }),
//       })

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) =>
//             player._id === playerId ? { ...player, isSold: true, team: teamId, soldPrice: price } : player,
//           ),
//         )
//         toast({
//           title: "Success",
//           description: "Player marked as sold",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to mark player as sold",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const getTeamName = (teamId: string | null) => {
//     if (!teamId) return "N/A"
//     const team = teams.find((t) => t._id === teamId)
//     return team ? team.name : "Unknown Team"
//   }

//   const filteredPlayers = players.filter((player) => filter.length === 0 || filter.includes(Math.floor(player.rating)))

//   return (
//     <div className="space-y-8">
//       <Button onClick={fetchData}>Refresh Data</Button>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {filteredPlayers.map((player) => (
//           <div key={player._id} className="relative">
//             <PlayerCard
//               player={{
//                 ...player,
//                 team: getTeamName(player.team),
//               }}
//               showRating={true}
//               isAdmin={true}
//               isSold={player.isSold}
//               showTeamAndPrice={true}
//             />
//             <div className="mt-4">
//               <label className="block mb-2">
//                 Team:
//                 <select
//                   value={player.team || ""}
//                   onChange={(e) => handleTeamChange(player._id, e.target.value)}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="">Select Team</option>
//                   {teams.map((team) => (
//                     <option key={team._id} value={team._id}>
//                       {team.name}
//                     </option>
//                   ))}
//                 </select>
//               </label>
//             </div>
//             <div className="mt-4">
//               <label className="block mb-2">
//                 Price:
//                 <input
//                   type="number"
//                   value={player.soldPrice}
//                   onChange={(e) => handlePriceChange(player._id, Number(e.target.value))}
//                   className="w-full p-2 border rounded"
//                 />
//               </label>
//             </div>
//             {!player.isSold && (
//               <Button onClick={() => handleSold(player._id, player.team!, player.soldPrice)} className="mt-4 w-full">
//                 Mark as Sold
//               </Button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/use-toast';

// interface Team {
//   _id: string;
//   name: string;
// }

// interface Player {
//   _id: string;
//   name: string;
//   rollNumber: string;
//   rating: number;
//   imageUrl: string;
//   team: string | null;
//   soldPrice: number;
//   isSold: boolean;
// }

// export function AuctionInterface() {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [playersRes, teamsRes] = await Promise.all([
//           fetch('/api/players'),
//           fetch('/api/teams')
//         ]);
        
//         if (playersRes.ok && teamsRes.ok) {
//           const [playersData, teamsData] = await Promise.all([
//             playersRes.json(),
//             teamsRes.json()
//           ]);
//           setPlayers(playersData);
//           setTeams(teamsData);
//         } else {
//           setError('Failed to fetch data');
//         }
//       } catch (error) {
//         setError('An error occurred. Please try again.');
//       }
//     };

//     fetchData();
//   }, []);

//   const handleTeamChange = async (playerId: string, teamId: string) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ team: teamId }),
//       });

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) =>
//             player._id === playerId ? { ...player, team: teamId } : player
//           )
//         );
//         toast({
//           title: "Success",
//           description: "Team updated successfully",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update team",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handlePriceChange = async (playerId: string, price: number) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ soldPrice: price }),
//       });

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) =>
//             player._id === playerId ? { ...player, soldPrice: price } : player
//           )
//         );
//         toast({
//           title: "Success",
//           description: "Price updated successfully",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update price",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleSold = async (playerId: string, teamId: string, price: number) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}/sold`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ team: teamId, soldPrice: price }),
//       });

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) =>
//             player._id === playerId ? { ...player, isSold: true, team: teamId, soldPrice: price } : player
//           )
//         );
//         toast({
//           title: "Success",
//           description: "Player marked as sold",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to mark player as sold",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {players.map((player) => (
//         <div key={player._id} className="border p-4 rounded-lg shadow-md">
//           <Image
//             src={player.imageUrl || "/placeholder.svg"}
//             alt={player.name}
//             width={200}
//             height={200}
//             className="w-full h-48 object-cover mb-4 rounded"
//           />
//           <h2 className="text-xl font-semibold">{player.name}</h2>
//           <p>Roll Number: {player.rollNumber}</p>
//           <p>Rating: {player.rating.toFixed(1)}</p>
//           <div className="mt-4">
//             <label className="block mb-2">
//               Team:
//               <select
//                 value={player.team || ''}
//                 onChange={(e) => handleTeamChange(player._id, e.target.value)}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="">Select Team</option>
//                 {teams.map((team) => (
//                   <option key={team._id} value={team._id}>
//                     {team.name}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>
//           <div className="mt-4">
//             <label className="block mb-2">
//               Price:
//               <input
//                 type="number"
//                 value={player.soldPrice}
//                 onChange={(e) => handlePriceChange(player._id, Number(e.target.value))}
//                 className="w-full p-2 border rounded"
//               />
//             </label>
//           </div>
//           {!player.isSold && (
//             <Button
//               onClick={() => handleSold(player._id, player.team!, player.soldPrice)}
//               className="mt-4 w-full"
//             >
//               Mark as Sold
//             </Button>
//           )}
//           {player.isSold && <p className="mt-4 text-green-600">Sold</p>}
//         </div>
//       ))}
//     </div>
//   );
// }

