"use client"

import { AuctionExpenseTable } from "@/components/AuctionExpenseTable"

export default function AuctionExpense() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auction Expense Table</h1>
      <AuctionExpenseTable />
    </div>
  )
}

