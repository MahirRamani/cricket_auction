"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Team {
  _id: string
  name: string
  budget: number
  players: {
    name: string
    price: number
  }[]
}

export function AuctionExpenseTable() {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams")
        if (response.ok) {
          const data = await response.json()
          setTeams(data)
        } else {
          console.error("Failed to fetch teams")
        }
      } catch (error) {
        console.error("Error fetching teams:", error)
      }
    }

    fetchTeams()
  }, [])

  const calculateRemainingBudget = (team: Team) => {
    const spentAmount = team.players.reduce((total, player) => total + player.price, 0)
    return team.budget - spentAmount
  }

  return (
    <Card className="w-full overflow-x-auto">
      <CardHeader className="p-2">
        <CardTitle className="text-lg">Auction Expense Table</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] px-1 py-2 text-xs">Team</TableHead>
              {[...Array(11)].map((_, index) => (
                <TableHead key={index} className="w-[80px] px-1 py-2 text-xs">
                  P{index + 1}
                </TableHead>
              ))}
              <TableHead className="w-[80px] px-1 py-2 text-xs">Remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team._id}>
                <TableCell className="px-1 py-2 text-xs font-medium">{team.name}</TableCell>
                {[...Array(11)].map((_, index) => (
                  <TableCell key={index} className="px-1 py-2 text-xs">
                    {team.players[index]
                      ? `${team.players[index].name.split(" ")[0]} (₹${team.players[index].price / 1000}K)`
                      : "-"}
                  </TableCell>
                ))}
                <TableCell className="px-1 py-2 text-xs">₹{calculateRemainingBudget(team) / 1000}K</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import '@/app/globals.css'

// interface Team {
//   _id: string
//   name: string
//   rollNumber: number
//   budget: number
//   players: {
//     name: string
//     price: number
//   }[]
// }

// export function AuctionExpenseTable() {
//   const [teams, setTeams] = useState<Team[]>([])

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const response = await fetch("/api/teams")
//         if (response.ok) {
//           const data = await response.json()
//           setTeams(data)
//         } else {
//           console.error("Failed to fetch teams")
//         }
//       } catch (error) {
//         console.error("Error fetching teams:", error)
//       }
//     }

//     fetchTeams()
//   }, [])

//   const calculateRemainingBudget = (team: Team) => {
//     const spentAmount = team.players.reduce((total, player) => total + player.price, 0)
//     return team.budget - spentAmount
//   }

//   return (
//     <Card className="w-full" style={{padding: 0}}>
//       <CardHeader style={{ alignItems: "center", padding: 5 }}>
//         <CardTitle style={{ padding: 0 }}>Auction Expense Table</CardTitle>
//       </CardHeader>
//       <CardContent className="p-0" style={{ padding: 0 }}>
//         <Table style={{ padding: 0 }}>
//           <TableHeader style={{ padding: 0 }}>
//             <TableRow style={{ padding: 0 }}>
//               <TableHead className="w-[10px] h-2  " style={{ padding: 10 }}>Team</TableHead>
//               {[...Array(11)].map((_, index) => (
//                 <TableHead key={index} className="w-[10px]" style={{ padding: 0 }}>
//                   Player {index + 1}
//                 </TableHead>
//               ))}
//               <TableHead className="w-[10px]" style={{ width: 10, padding: 0 }}>Remaining Budget</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody style={{ padding: 0 }}>
//             {teams.map((team) => (
//               <TableRow key={team._id} style={{ padding: 0 }}>
//                 <TableCell className="font-medium h-2" style={{ padding: 0, paddingLeft: 10 }}>{team.name}</TableCell>
//                 {[...Array(11)].map((_, index) => (
//                   <TableCell key={index} className="text-xs" style={{ padding: 10 }}>
//                     {/* {team.players[index]
//                       ? `${team.players[index].name.split(" ")[0]} (₹${team.players[index].price})`
//                       : "-"} */}
//                     {team.players[index]
//                       ? `${757} (₹${team.players[index].price})`
//                       : "-"}
//                   </TableCell>
//                 ))}
//                 <TableCell style={{ padding: 0 }}>₹{calculateRemainingBudget(team)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface Team {
//   id: string
//   name: string
//   budget: number
//   players: {
//     id: string
//     name: string
//     price: number
//   }[]
// }

// export function AuctionExpenseTable() {
//   const [teams, setTeams] = useState<Team[]>([])

//   useEffect(() => {
//     // In a real application, you'd fetch this data from your API
//     const fetchTeams = async () => {
//       // Simulated data for demonstration
//       const simulatedTeams: Team[] = [
//         {
//           id: "1",
//           name: "VSSC Trivandrum",
//           budget: 1000000,
//           players: [
//             { id: "1", name: "Player 1", price: 200000 },
//             { id: "2", name: "Player 2", price: 150000 },
//           ],
//         },
//         {
//           id: "2",
//           name: "ISRO Satellite Centre",
//           budget: 1000000,
//           players: [{ id: "3", name: "Player 3", price: 180000 }],
//         },
//         {
//           id: "3",
//           name: "Space Applications Centre",
//           budget: 1000000,
//           players: [
//             { id: "4", name: "Player 4", price: 220000 },
//             { id: "5", name: "Player 5", price: 190000 },
//           ],
//         },
//       ]
//       setTeams(simulatedTeams)
//     }

//     fetchTeams()
//   }, [])

//   const calculateRemainingBudget = (team: Team) => {
//     const spentBudget = team.players.reduce((total, player) => total + player.price, 0)
//     return team.budget - spentBudget
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Auction Expense Table</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ISRO Center</TableHead>
//               <TableHead>Colony 1</TableHead>
//               <TableHead>Colony 2</TableHead>
//               <TableHead>Colony 3</TableHead>
//               <TableHead>Total Spent</TableHead>
//               <TableHead>Remaining Budget</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {teams.map((team) => (
//               <TableRow key={team.id}>
//                 <TableCell className="font-medium">{team.name}</TableCell>
//                 {[0, 1, 2].map((index) => (
//                   <TableCell key={index}>
//                     {team.players[index]
//                       ? `${team.players[index].name} (₹${team.players[index].price.toLocaleString()})`
//                       : "-"}
//                   </TableCell>
//                 ))}
//                 <TableCell>
//                   ₹{team.players.reduce((total, player) => total + player.price, 0).toLocaleString()}
//                 </TableCell>
//                 <TableCell>₹{calculateRemainingBudget(team).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }




// working
// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface Team {
//   _id: string
//   name: string
//   budget: number
//   players: {
//     name: string
//     price: number
//   }[]
// }

// export function AuctionExpenseTable() {
//   const [teams, setTeams] = useState<Team[]>([])

//   useEffect(() => {
//     // Fetch teams data from API
//     const fetchTeams = async () => {
//       try {
//         const response = await fetch("/api/teams")
//         if (response.ok) {
//           const data = await response.json()
//           setTeams(data)
//         } else {
//           console.error("Failed to fetch teams")
//         }
//       } catch (error) {
//         console.error("Error fetching teams:", error)
//       }
//     }

//     fetchTeams()
//   }, [])

//   const calculateRemainingBudget = (team: Team) => {
//     const spentAmount = team.players.reduce((total, player) => total + player.price, 0)
//     return team.budget - spentAmount
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Auction Expense Table</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Team (ISRO)</TableHead>
//               <TableHead>Player 1</TableHead>
//               <TableHead>Player 2</TableHead>
//               <TableHead>Player 3</TableHead>
//               <TableHead>Remaining Budget</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {teams.map((team) => (
//               <TableRow key={team._id}>
//                 <TableCell className="font-medium">{team.name}</TableCell>
//                 {[0, 1, 2].map((index) => (
//                   <TableCell key={index}>
//                     {team.players[index] ? `${team.players[index].name} (₹${team.players[index].price})` : "-"}
//                   </TableCell>
//                 ))}
//                 <TableCell>₹{calculateRemainingBudget(team)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }



// working
// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface Team {
//   _id: string
//   name: string
//   budget: number
//   players: {
//     name: string
//     price: number
//   }[]
// }

// export function AuctionExpenseTable() {
//   const [teams, setTeams] = useState<Team[]>([])

//   useEffect(() => {
//     // Fetch teams data from API
//     const fetchTeams = async () => {
//       try {
//         const response = await fetch("/api/teams")
//         if (response.ok) {
//           const data = await response.json()
//           setTeams(data)
//         } else {
//           console.error("Failed to fetch teams")
//         }
//       } catch (error) {
//         console.error("Error fetching teams:", error)
//       }
//     }

//     fetchTeams()
//   }, [])

//   const calculateRemainingBudget = (team: Team) => {
//     const spentAmount = team.players.reduce((total, player) => total + player.price, 0)
//     return team.budget - spentAmount
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Auction Expense Table</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Team (ISRO)</TableHead>
//               <TableHead>Player 1</TableHead>
//               <TableHead>Player 2</TableHead>
//               <TableHead>Player 3</TableHead>
//               <TableHead>Remaining Budget</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {teams.map((team) => (
//               <TableRow key={team._id}>
//                 <TableCell className="font-medium">{team.name}</TableCell>
//                 {[0, 1, 2].map((index) => (
//                   <TableCell key={index}>
//                     {team.players[index] ? `${team.players[index].name} (₹${team.players[index].price})` : "-"}
//                   </TableCell>
//                 ))}
//                 <TableCell>₹{calculateRemainingBudget(team)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// interface Player {
//   name: string
//   price: number
//   isCaptain?: boolean
//   isViceCaptain?: boolean
// }

// interface Team {
//   _id: string
//   name: string
//   budget: number
//   players: Player[]
// }

// export function AuctionExpenseTable() {
//   const [teams, setTeams] = useState<Team[]>([])

//   useEffect(() => {
//     fetchTeams()
//   }, [])

//   const fetchTeams = async () => {
//     try {
//       const response = await fetch("/api/teams")
//       if (response.ok) {
//         const data = await response.json()
//         setTeams(data)
//       } else {
//         console.error("Failed to fetch teams")
//       }
//     } catch (error) {
//       console.error("Error fetching teams:", error)
//     }
//   }

//   const calculateRemainingBudget = (team: Team) => {
//     const spentAmount = team.players.reduce((total, player) => total + player.price, 0)
//     return team.budget - spentAmount
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>Auction Expense Table</CardTitle>
//         <Button onClick={fetchTeams}>Refresh</Button>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Team (ISRO)</TableHead>
//               {[...Array(15)].map((_, index) => (
//                 <TableHead key={index}>Player {index + 1}</TableHead>
//               ))}
//               <TableHead>Remaining Budget</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {teams.map((team) => (
//               <TableRow key={team._id}>
//                 <TableCell className="font-medium">{team.name}</TableCell>
//                 {[...Array(15)].map((_, index) => (
//                   <TableCell key={index}>
//                     {team.players[index] ? (
//                       <>
//                         {team.players[index].name}
//                         {team.players[index].isCaptain && " (C)"}
//                         {team.players[index].isViceCaptain && " (VC)"}
//                         <br />₹{team.players[index].price}
//                       </>
//                     ) : (
//                       "-"
//                     )}
//                   </TableCell>
//                 ))}
//                 <TableCell>₹{calculateRemainingBudget(team)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }

