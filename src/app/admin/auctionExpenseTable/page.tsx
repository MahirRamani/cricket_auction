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

export default function AuctionExpenseTable() {
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