import  BiddingInterface  from "@/components/BiddingInterface"

export default function AdminAuction() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player Auction</h1>
      <BiddingInterface />
    </div>
  )
}