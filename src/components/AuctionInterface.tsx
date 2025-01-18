'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Player {
  _id: string;
  name: string;
  rollNumber: string;
  averageRating: number;
  isSold: boolean;
}

export default function AuctionInterface() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleSold = async (playerId: string) => {
    try {
      const response = await fetch(`/api/players/${playerId}/sold`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to mark player as sold');

      setPlayers(players.map(player => 
        player._id === playerId ? { ...player, isSold: true } : player
      ));
    } catch (err) {
      setError('Failed to mark player as sold');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map(player => (
        <div key={player._id} className={`bg-white shadow-md rounded-lg p-6 ${player.isSold ? 'opacity-50' : ''}`}>
          <div className="flex items-center mb-4">
            <Image
              src={`/placeholder.svg?height=100&width=100`}
              alt={player.name}
              width={100}
              height={100}
              className="rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{player.name}</h2>
              <p className="text-gray-600">Roll Number: {player.rollNumber}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= player.averageRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {!player.isSold ? (
              <button
                onClick={() => handleSold(player._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                aria-label={`Mark ${player.name} as sold`}
              >
                Sold
              </button>
            ) : (
              <span className="text-green-600 font-semibold">Sold</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

