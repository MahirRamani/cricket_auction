import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PlayerCardProps {
  player: {
    _id: string;
    name: string;
    rollNumber: string;
    rating: number;
    imageUrl: string;
  };
  showRating?: boolean;
  onRatingChange?: (playerId: string, rating: number) => void;
  currentRating?: number;
}

export function PlayerCard({ player, showRating = false, onRatingChange, currentRating }: PlayerCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Image
        src={player.imageUrl || "/placeholder.svg"}
        alt={player.name}
        width={200}
        height={200}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h2 className="text-xl font-semibold">{player.name}</h2>
      <p>Roll Number: {player.rollNumber}</p>
      {showRating && <p>Rating: {player.rating.toFixed(1)}</p>}
      {onRatingChange && (
        <div className="mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              onClick={() => onRatingChange(player._id, star)}
              variant={currentRating && currentRating >= star ? "default" : "outline"}
              className="mr-1"
            >
              ★
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}


// import { useState } from "react"
// import { cn } from "@/lib/utils"
// import { StarRating } from "./StarRating"

// interface PlayerCardProps {
//   player: {
//     _id: string
//     name: string
//     rollNumber: string
//     rating: number
//     imageUrl: string
//     votesReceived?: number
//     team?: string
//     soldPrice?: number
//   }
//   showRating?: boolean
//   onRatingChange?: (playerId: string, rating: number) => void
//   currentRating?: number
//   isAdmin?: boolean
//   isSold?: boolean
//   showTeamAndPrice?: boolean
//   showVotesReceived?: boolean
// }

// export function PlayerCard({
//   player,
//   showRating = false,
//   onRatingChange,
//   currentRating,
//   isAdmin = false,
//   isSold = false,
//   showTeamAndPrice = false,
//   showVotesReceived = false,
// }: PlayerCardProps) {
//   const [isHovered, setIsHovered] = useState(false)

//   return (
//     <div
//       className={cn(
//         "border p-4 rounded-lg shadow-md transition-all duration-300 h-[250px] relative",
//         isSold && "bg-red-100",
//         isSold && isHovered && "bg-red-200",
//       )}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="flex items-center mb-4">
//         <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
//           <img src={player.imageUrl || "/placeholder.svg"} alt={player.name} className="w-full h-full object-cover" />
//         </div>
//         <div className="flex flex-col justify-center">
//           <h2 className="text-lg font-semibold leading-tight">{player.name}</h2>
//           <p className="text-sm text-gray-600 leading-tight">Roll Number: {player.rollNumber}</p>
//         </div>
//       </div>
//       {showRating && (
//         <div className="mb-2">
//           <p>Rating:</p>
//           <StarRating rating={player.rating} />
//         </div>
//       )}
//       {onRatingChange && (
//         <div className="mt-2">
//           <p>Your Rating:</p>
//           <StarRating
//             rating={currentRating || 0}
//             onRatingChange={(rating) => onRatingChange(player._id, rating)}
//             editable={true}
//           />
//         </div>
//       )}
//       {showVotesReceived && <p className="mt-2">Votes Received: {player.votesReceived}</p>}
//       {showTeamAndPrice && (
//         <div className="flex justify-between mt-2">
//           <p>Team: {player.team || "N/A"}</p>
//           <p>Price: ₹{player.soldPrice || 0}</p>
//         </div>
//       )}
//       {isAdmin && isSold && (
//         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-20 rotate-[-10deg]">
//           <div className="relative w-full h-full">
//             <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-pulse"></div>
//             <div className="absolute inset-2 border-2 border-red-600 rounded-full"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-red-600 font-bold text-xs transform rotate-[10deg]">
//                 <svg viewBox="0 0 100 100" className="w-full h-full">
//                   <path id="curve" fill="transparent" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0" />
//                   <text fontSize="8">
//                     <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
//                       SPORTDAY
//                     </textPath>
//                   </text>
//                 </svg>
//               </div>
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className="text-red-600 font-bold text-lg transform rotate-[10deg]">SOLD</span>
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-red-600 font-bold text-xs transform rotate-[10deg] mt-8">
//                 <svg viewBox="0 0 100 100" className="w-full h-full">
//                   <path id="curve2" fill="transparent" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0" />
//                   <text fontSize="8">
//                     <textPath xlinkHref="#curve2" startOffset="50%" textAnchor="middle">
//                       2000
//                     </textPath>
//                   </text>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

