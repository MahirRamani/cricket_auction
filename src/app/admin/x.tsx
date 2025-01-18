'use client';

import { useState, useEffect } from 'react';

interface Player {
  _id: string;
  name: string;
  rollNumber: string;
  rating: number;
  votesReceived: number;
  isSold: boolean;
}

export default function AdminDashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<number[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const res = await fetch('/api/players');
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
      } else {
        setError('Failed to fetch players');
      }
    };

    fetchPlayers();
  }, []);

  const handleEditRating = async (playerId: string, newRating: number) => {
    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating }),
      });

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === playerId ? { ...player, rating: newRating } : player
          )
        );
      } else {
        setError('Failed to update rating');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSold = async (playerId: string) => {
    try {
      const res = await fetch(`/api/players/${playerId}/sold`, {
        method: 'PATCH',
      });

      if (res.ok) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === playerId ? { ...player, isSold: true } : player
          )
        );
      } else {
        setError('Failed to mark player as sold');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleFilterChange = (star: number) => {
    setFilter(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star) 
        : [...prev, star]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        Filter by stars: 
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleFilterChange(star)}
            className={`ml-2 px-3 py-1 rounded ${
              filter.includes(star) ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {star} ★
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Roll Number</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Votes Received</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players
            .filter(player => filter.length === 0 || filter.includes(Math.floor(player.rating)))
            .map((player) => (
              <tr key={player._id} className={player.isSold ? 'bg-gray-100' : ''}>
                <td className="border p-2">{player.name}</td>
                <td className="border p-2">{player.rollNumber}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={player.rating}
                    onChange={(e) => handleEditRating(player._id, Number(e.target.value))}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-16 px-1 py-0.5 border rounded"
                  />
                </td>
                <td className="border p-2">{player.votesReceived}</td>
                <td className="border p-2">
                  {!player.isSold && (
                    <button
                      onClick={() => handleSold(player._id)}
                      className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                    >
                      Mark as Sold
                    </button>
                  )}
                  {player.isSold && <span className="text-green-600">Sold</span>}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

