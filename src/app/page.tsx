import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Cricket Player Rating and Auction</h1>
        <div className="space-y-4">
          <Link href="/login" className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Player Login
          </Link>
          <Link href="/admin" className="block text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

