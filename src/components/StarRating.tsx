import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  editable?: boolean
}

export function StarRating({ rating, onRatingChange, editable = false }: StarRatingProps) {
  const saffronColor = "#FF9933" // Saffron color

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 ${star <= rating ? "text-[#FF9933]" : "text-gray-300"} ${editable ? "cursor-pointer" : ""}`}
          fill={star <= rating ? saffronColor : "none"}
          onClick={() => editable && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  )
}

