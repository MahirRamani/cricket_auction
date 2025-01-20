'use client';

import { AdminRatingInterface } from '@/components/AdminRatingInterface';

export default function AdminRating() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Rating Dashboard</h1>
      <AdminRatingInterface />
    </div>
  );
}

