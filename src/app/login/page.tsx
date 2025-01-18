'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("handleSubmit");  
    
    setError("");
    // setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        mobileNumber,
        password,
        redirect: false,
        callbackUrl: "/"
      });
      console.log("res", res);
      
      if (res?.ok) {
        // toast.success("Logged in successfully");
        router.push("/rate");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      // eslint-di
    }
  }

  console.log("mobileNumber", mobileNumber);
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="mobileNumber" className="block mb-1">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="button" onClick={()=> handleSubmit()} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

