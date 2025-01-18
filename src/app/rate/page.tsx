'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface Player {
  _id: string;
  name: string;
  rollNumber: string;
}

export default function Rate() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPlayers = async () => {
      const res = await fetch('/api/players');
      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        
        setPlayers(data);
      } else {
        setError('Failed to fetch players');
      }
    };

    fetchPlayers();
  }, []);

  const handleRating = (playerId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [playerId]: rating }));
  };

  const handleSubmit = async () => {
    // if (Object.keys(ratings).length < 30) {
    //   setError('You must rate at least 30 players');
    //   return;
    // }

    // const fiveStarCount = Object.values(ratings).filter((r) => r === 5).length;
    // const oneStarCount = Object.values(ratings).filter((r) => r === 1).length;

    // if (fiveStarCount > 10) {
    //   setError('Invalid fiveStarCount rating distribution');
    //   return;
    // }

    // if (oneStarCount > 10) {
    //   setError('Invalid oneStarCount rating distribution');
    //   return;
    // }



    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ratings: Object.entries(ratings).map(([playerId, rating]) => ({ playerId, rating })) }),
      });

      if (res.ok) {

        await signOut({
          redirect: false
        });

        router.push('/thank-you');
      } else {
        const errorData = await res.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An error occurred from server. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rate Players</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player._id} className="border p-4 rounded">
            <h2 className="font-bold">{player.name}</h2>
            <p>Roll Number: {player.rollNumber}</p>
            <div className="mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(player._id, star)}
                  className={`text-2xl ${ratings[player._id] >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit Ratings
      </button>
    </div>
  );
}

