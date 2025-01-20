"use client"

import { useState } from "react"
import { AuctionInterface } from "@/components/AuctionInterface"
import { AuctionExpenseTable } from "@/components/AuctionExpenseTable"
import { Button } from "@/components/ui/button"

export default function AdminAuction() {
  const [showExpenseTable, setShowExpenseTable] = useState(false)
  const [filter, setFilter] = useState<number[]>([])

  const handleFilterChange = (star: number) => {
    setFilter((prev) => (prev.includes(star) ? prev.filter((f) => f !== star) : [...prev, star]))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Auction</h1>
      <div className="mb-4">
        Filter by stars:
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            onClick={() => handleFilterChange(star)}
            variant={filter.includes(star) ? "default" : "outline"}
            className="ml-2"
          >
            {star} {"\u2605"}
          </Button>
        ))}
      </div>
      <Button onClick={() => setShowExpenseTable(!showExpenseTable)} className="mb-4">
        {showExpenseTable ? "Show Auction Interface" : "Show Expense Table"}
      </Button>
      {showExpenseTable ? <AuctionExpenseTable /> : <AuctionInterface filter={filter} />}
    </div>
  )
}



// 'use client';

// import { useState, useEffect } from 'react';
// import { Star } from 'lucide-react';

// interface Player {
//   _id: string;
//   name: string;
//   rollNumber: string;
//   rating: number;
//   votesReceived: number;
//   isSold: boolean;
// }

// export default function AdminDashboard() {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [error, setError] = useState('');
//   const [filter, setFilter] = useState<number[]>([]);
//   const [sortBy, setSortBy] = useState<'name' | 'rating' | 'votesReceived'>('votesReceived');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const res = await fetch('/api/players');
//         if (res.ok) {
//           const data = await res.json();
//           setPlayers(data);
//         } else {
//           setError('Failed to fetch players');
//         }
//       } catch (error) {
//         setError('An error occurred while fetching players');
//       }
//     };

//     fetchPlayers();
//   }, []);

//   const handleEditRating = async (playerId: string, newRating: number) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ rating: newRating }),
//       });

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) =>
//             player._id === playerId ? { ...player, rating: newRating } : player
//           )
//         );
//       } else {
//         setError('Failed to update rating');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//     }
//   };

//   const handleSold = async (playerId: string) => {
//     try {
//       const res = await fetch(`/api/players/${playerId}/sold`, {
//         method: 'PATCH',
//       });

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) =>
//             player._id === playerId ? { ...player, isSold: true } : player
//           )
//         );
//       } else {
//         setError('Failed to mark player as sold');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//     }
//   };

//   const handleFilterChange = (star: number) => {
//     setFilter(prev => 
//       prev.includes(star) 
//         ? prev.filter(s => s !== star) 
//         : [...prev, star]
//     );
//   };

//   const handleSort = (column: 'name' | 'rating' | 'votesReceived') => {
//     if (sortBy === column) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(column);
//       setSortOrder('asc');
//     }
//   };

//   const sortedPlayers = [...players].sort((a, b) => {
//     if (sortBy === 'name') {
//       return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
//     } else {
//       return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
//     }
//   });

//   const filteredPlayers = sortedPlayers.filter(player => 
//     filter.length === 0 || filter.includes(Math.floor(player.rating))
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Filter by stars:</h2>
//         <div className="flex space-x-2">
//           {[1, 2, 3, 4, 5].map(star => (
//             <button
//               key={star}
//               onClick={() => handleFilterChange(star)}
//               className={`px-4 py-2 rounded-full ${
//                 filter.includes(star) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
//               } hover:bg-blue-600 hover:text-white transition-colors`}
//             >
//               {star} <Star className="inline-block w-4 h-4 ml-1" />
//             </button>
//           ))}
//         </div>
//       </div>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <button onClick={() => handleSort('name')} className="font-bold hover:text-gray-700">
//                   Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
//                 </button>
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <button onClick={() => handleSort('rating')} className="font-bold hover:text-gray-700">
//                   Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '▲' : '▼')}
//                 </button>
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <button onClick={() => handleSort('votesReceived')} className="font-bold hover:text-gray-700">
//                   Votes Received {sortBy === 'votesReceived' && (sortOrder === 'asc' ? '▲' : '▼')}
//                 </button>
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredPlayers.map((player) => (
//               <tr key={player._id} className={`relative ${player.isSold ? 'bg-green-50' : ''}`}>
//                 <td className="px-6 py-4 whitespace-nowrap">{player.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{player.rollNumber}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <input
//                     type="number"
//                     value={player.rating}
//                     onChange={(e) => handleEditRating(player._id, Number(e.target.value))}
//                     min="0"
//                     max="5"
//                     step="0.1"
//                     className="w-20 px-2 py-1 border rounded"
//                   />
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">{player.votesReceived}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {!player.isSold ? (
//                     <button
//                       onClick={() => handleSold(player._id)}
//                       className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded transition-colors"
//                     >
//                       Mark as Sold
//                     </button>
//                   ) : (
//                     <span className="text-green-600 font-semibold">Sold</span>
//                   )}
//                 </td>
//                 {player.isSold && (
//                   <td className="absolute inset-0 flex items-center justify-center">
//                     <div className="sold-stamp">SOLD</div>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

