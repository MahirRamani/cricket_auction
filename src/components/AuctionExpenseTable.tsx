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
    // Fetch teams data from API
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auction Expense Table</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team (ISRO)</TableHead>
              <TableHead>Player 1</TableHead>
              <TableHead>Player 2</TableHead>
              <TableHead>Player 3</TableHead>
              <TableHead>Remaining Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team._id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                {[0, 1, 2].map((index) => (
                  <TableCell key={index}>
                    {team.players[index] ? `${team.players[index].name} (₹${team.players[index].price})` : "-"}
                  </TableCell>
                ))}
                <TableCell>₹{calculateRemainingBudget(team)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}



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

