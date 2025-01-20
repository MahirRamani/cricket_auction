"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { PlayerCard } from "@/components/PlayerCard"
import { StarRating } from "./StarRating"

interface Player {
  _id: string
  name: string
  rollNumber: string
  rating: number
  votesReceived: number
  imageUrl: string
}

export function AdminRatingInterface() {
  const [players, setPlayers] = useState<Player[]>([])
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<number[]>([])
  const [editedRatings, setEditedRatings] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    const res = await fetch("/api/players")
    if (res.ok) {
      const data = await res.json()
      setPlayers(data)
      const initialRatings: { [key: string]: number } = {}
      data.forEach((player: Player) => {
        initialRatings[player._id] = player.rating
      })
      setEditedRatings(initialRatings)
    } else {
      setError("Failed to fetch players")
    }
  }

  const handleEditRating = (playerId: string, newRating: number) => {
    setEditedRatings((prev) => ({ ...prev, [playerId]: newRating }))
  }

  const handleSubmit = async () => {
    try {
      const updates = Object.entries(editedRatings).map(([playerId, rating]) => ({
        playerId,
        rating,
      }))

      const res = await fetch("/api/players/updateRatings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      })

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => ({
            ...player,
            rating: editedRatings[player._id] || player.rating,
          })),
        )
        toast({
          title: "Success",
          description: "Ratings updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update ratings",
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

  const handleFilterChange = (star: number) => {
    setFilter((prev) => (prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]))
  }

  return (
    <div>
      <div className="mb-4">
        Filter by stars:
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            onClick={() => handleFilterChange(star)}
            variant={filter.includes(star) ? "default" : "outline"}
            className="ml-2"
          >
            <StarRating rating={star} />
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players
          .filter((player) => filter.length === 0 || filter.includes(Math.floor(player.rating)))
          .map((player) => (
            <div key={player._id}>
              <PlayerCard player={player} showRating={true} showVotesReceived={true} />
              <div className="mt-2">
                <label className="block">
                  Edit Rating:
                  <StarRating
                    rating={editedRatings[player._id]}
                    onRatingChange={(rating) => handleEditRating(player._id, rating)}
                    editable={true}
                  />
                </label>
              </div>
            </div>
          ))}
      </div>
      <Button onClick={handleSubmit} className="mt-4">
        Submit Changes
      </Button>
    </div>
  )
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/use-toast';

// interface Player {
//   _id: string;
//   name: string;
//   rollNumber: string;
//   rating: number;
//   votesReceived: number;
// }

// export default function AdminRatingInterface() {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [error, setError] = useState('');
//   const [filter, setFilter] = useState<number[]>([]);
//   const [editedRatings, setEditedRatings] = useState<{ [key: string]: number }>({});

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       const res = await fetch('/api/players');
//       if (res.ok) {
//         const data = await res.json();
//         setPlayers(data);
//         const initialRatings: { [key: string]: number } = {};
//         data.forEach((player: Player) => {
//           initialRatings[player._id] = player.rating;
//         });
//         setEditedRatings(initialRatings);
//       } else {
//         setError('Failed to fetch players');
//       }
//     };

//     fetchPlayers();
//   }, []);

//   const handleEditRating = (playerId: string, newRating: number) => {
//     setEditedRatings((prev) => ({ ...prev, [playerId]: newRating }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const updates = Object.entries(editedRatings).map(([playerId, rating]) => ({
//         playerId,
//         rating,
//       }));

//       const res = await fetch('/api/players/updateRatings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ updates }),
//       });

//       if (res.ok) {
//         setPlayers((prevPlayers) =>
//           prevPlayers.map((player) => ({
//             ...player,
//             rating: editedRatings[player._id] || player.rating,
//           }))
//         );
//         toast({
//           title: "Success",
//           description: "Ratings updated successfully",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update ratings",
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

//   const handleFilterChange = (star: number) => {
//     setFilter(prev => 
//       prev.includes(star) 
//         ? prev.filter(s => s !== star) 
//         : [...prev, star]
//     );
//   };

//   return (
//     <div>
//       <div className="mb-4">
//         Filter by stars: 
//         {[1, 2, 3, 4, 5].map(star => (
//           <Button
//             key={star}
//             onClick={() => handleFilterChange(star)}
//             variant={filter.includes(star) ? "default" : "outline"}
//             className="ml-2"
//           >
//             {star} ★
//           </Button>
//         ))}
//       </div>
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Roll Number</th>
//             <th className="border p-2">Rating</th>
//             <th className="border p-2">Votes Received</th>
//           </tr>
//         </thead>
//         <tbody>
//           {players
//             .filter(player => filter.length === 0 || filter.includes(Math.floor(player.rating)))
//             .map((player) => (
//               <tr key={player._id}>
//                 <td className="border p-2">{player.name}</td>
//                 <td className="border p-2">{player.rollNumber}</td>
//                 <td className="border p-2">
//                   <input
//                     type="number"
//                     value={editedRatings[player._id]}
//                     onChange={(e) => handleEditRating(player._id, Number(e.target.value))}
//                     min="0"
//                     max="5"
//                     step="0.1"
//                     className="w-16 px-1 py-0.5 border rounded"
//                   />
//                 </td>
//                 <td className="border p-2">{player.votesReceived}</td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//       <Button
//         onClick={handleSubmit}
//         className="mt-4"
//       >
//         Submit Changes
//       </Button>
//     </div>
//   );
// }






// // 'use client';

// // import { useState, useEffect } from 'react';
// // import Image from 'next/image';
// // import { Button } from "@/components/ui/button";
// // import { toast } from "@/components/ui/use-toast";

// // interface Player {
// //   _id: string;
// //   name: string;
// //   rollNumber: string;
// //   averageRating: number;
// // }

// // interface RatingCount {
// //   [key: number]: number;
// // }

// // interface RatingData {
// //   playerId: string;
// //   rating: number;
// // }

// // export default function RatingInterface() {
// //   const [players, setPlayers] = useState<Player[]>([]);
// //   const [ratings, setRatings] = useState<{ [key: string]: number }>({});
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState('');

// //   // Track count of each star rating
// //   const [ratingCounts, setRatingCounts] = useState<RatingCount>({
// //     1: 0,
// //     2: 0,
// //     3: 0,
// //     4: 0,
// //     5: 0
// //   });

// //   useEffect(() => {
// //     fetchPlayers();
// //   }, []);

// //   const fetchPlayers = async () => {
// //     try {
// //       const response = await fetch('/api/players');
// //       if (!response.ok) throw new Error('Failed to fetch players');
// //       const data = await response.json();
// //       setPlayers(data);
// //     } catch (err) {
// //       setError('Failed to load players');
// //       toast({
// //         title: "Error",
// //         description: "Failed to load players",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleRating = (playerId: string, rating: number) => {
// //     // Remove old rating count if exists
// //     if (ratings[playerId]) {
// //       setRatingCounts(prev => ({
// //         ...prev,
// //         [ratings[playerId]]: prev[ratings[playerId]] - 1
// //       }));
// //     }

// //     // Add new rating count
// //     setRatingCounts(prev => ({
// //       ...prev,
// //       [rating]: prev[rating] + 1
// //     }));

// //     setRatings(prev => ({
// //       ...prev,
// //       [playerId]: rating
// //     }));
// //   };

// //   const validateRatings = () => {
// //     // Check if at least 30 players are rated
// //     const ratedPlayersCount = Object.keys(ratings).length;
// //     if (ratedPlayersCount < 30) {
// //       toast({
// //         title: "Error",
// //         description: "You must rate at least 30 players",
// //         variant: "destructive",
// //       });
// //       return false;
// //     }

// //     // Check if maximum 10 players have 5 stars
// //     if (ratingCounts[5] > 10) {
// //       toast({
// //         title: "Error",
// //         description: "You can only give 5 stars to a maximum of 10 players",
// //         variant: "destructive",
// //       });
// //       return false;
// //     }

// //     // Check if maximum 1 player has 1 star
// //     if (ratingCounts[1] > 1) {
// //       toast({
// //         title: "Error",
// //         description: "You can only give 1 star to a maximum of 1 player",
// //         variant: "destructive",
// //       });
// //       return false;
// //     }

// //     return true;
// //   };

// //   const handleSubmit = async () => {
// //     if (!validateRatings()) return;

// //     setSubmitting(true);
// //     try {
// //       // Only send ratings that have been given
// //       const ratingsToSubmit: RatingData[] = Object.entries(ratings).map(([playerId, rating]) => ({
// //         playerId,
// //         rating
// //       }));

// //       const response = await fetch('/api/ratings', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ ratings: ratingsToSubmit }),
// //       });

// //       if (!response.ok) throw new Error('Failed to submit ratings');

// //       toast({
// //         title: "Success",
// //         description: "Ratings submitted successfully",
// //       });

// //       // Redirect to thank you page or disable further rating
// //       window.location.href = '/thank-you';
// //     } catch (err) {
// //       setError('Failed to submit ratings');
// //       toast({
// //         title: "Error",
// //         description: "Failed to submit ratings",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   if (loading) return (
// //     <div className="flex justify-center items-center min-h-[400px]">
// //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
// //     </div>
// //   );

// //   return (
// //     <div className="space-y-6">
// //       <div className="bg-white p-4 rounded-lg shadow mb-6">
// //         <h2 className="text-xl font-bold mb-2">Rating Guidelines:</h2>
// //         <ul className="list-disc pl-5 space-y-1">
// //           <li>You must rate at least 30 players</li>
// //           <li>You can give 5 stars to maximum 10 players</li>
// //           <li>You can give 1 star to maximum 1 player</li>
// //         </ul>
// //         <div className="mt-4 grid grid-cols-2 gap-4">
// //           <div>
// //             <p className="font-semibold">Current Ratings:</p>
// //             <p>5 stars: {ratingCounts[5]} players</p>
// //             <p>1 star: {ratingCounts[1]} players</p>
// //           </div>
// //           <div>
// //             <p className="font-semibold">Total Players Rated:</p>
// //             <p>{Object.keys(ratings).length} of 30 minimum</p>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {players.map(player => (
// //           <div key={player._id} className="bg-white shadow-md rounded-lg p-6">
// //             <div className="flex items-center mb-4">
// //               <Image
// //                 src={`/placeholder.svg?height=100&width=100`}
// //                 alt={player.name}
// //                 width={100}
// //                 height={100}
// //                 className="rounded-full mr-4"
// //               />
// //               <div>
// //                 <h2 className="text-xl font-semibold">{player.name}</h2>
// //                 <p className="text-gray-600">Roll Number: {player.rollNumber}</p>
// //               </div>
// //             </div>
// //             <div className="flex items-center justify-between">
// //               <div className="flex">
// //                 {[1, 2, 3, 4, 5].map(star => (
// //                   <button
// //                     key={star}
// //                     onClick={() => handleRating(player._id, star)}
// //                     className={`text-2xl transition-colors ${
// //                       star <= (ratings[player._id] || 0)
// //                         ? 'text-yellow-400 hover:text-yellow-500'
// //                         : 'text-gray-300 hover:text-gray-400'
// //                     }`}
// //                     aria-label={`Rate ${star} stars`}
// //                   >
// //                     ★
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center">
// //         <Button
// //           onClick={handleSubmit}
// //           disabled={submitting || Object.keys(ratings).length < 30}
// //           className="px-6 py-2 text-lg"
// //         >
// //           {submitting ? 'Submitting...' : 'Submit Ratings'}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

