"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import  AuctionInterface from "@/components/AuctionInterface"
import { AuctionExpenseTable } from "@/components/AuctionExpenseTable"

export default function AdminAuction() {
  const [filter, setFilter] = useState<number[]>([])

  const handleFilterChange = (star: number) => {
    setFilter((prev) => (prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player Auction</h1>
      <div className="mb-4">
        Filter by stars:
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            onClick={() => handleFilterChange(star)}
            variant={filter.includes(star) ? "default" : "outline"}
            className="ml-2"
          >
            {star} ★
          </Button>
        ))}
      </div>
      <div className="">
        <div>
          <AuctionInterface filter={filter} />
        </div>
        <div>
          {/* <AuctionExpenseTable /> */}
        </div>
      </div>
    </div>
  )
}