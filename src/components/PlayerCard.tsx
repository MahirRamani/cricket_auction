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
