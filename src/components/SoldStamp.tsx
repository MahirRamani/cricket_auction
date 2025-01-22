interface SoldStampProps {
    className?: string
  }
  
  export function SoldStamp({ className = "" }: SoldStampProps) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" className="w-48 h-48 transform rotate-[-20deg]">
          {/* Outer circle with scalloped edge */}
          <path
            d="M100,0 C120,0 140,10 160,30 C180,50 190,70 190,100 C190,120 180,140 160,160 C140,180 120,190 100,190 C80,190 60,180 40,160 C20,140 10,120 10,100 C10,70 20,50 40,30 C60,10 80,0 100,0 Z"
            fill="none"
            stroke="#FF0000"
            strokeWidth="2"
          />
  
          {/* Inner circle */}
          <circle cx="100" cy="100" r="70" fill="none" stroke="#FF0000" strokeWidth="2" />
  
          {/* SOLD text */}
          <text x="100" y="110" textAnchor="middle" fontSize="40" fill="#FF0000" fontWeight="bold">
            SOLD
          </text>
  
          {/* Curved Sports Day 2000 text */}
          <path id="curve" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" stroke="none" />
          <text fontSize="16" fill="#FF0000">
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              Sports Day 2000
            </textPath>
          </text>
        </svg>
      </div>
    )
  }
  
  