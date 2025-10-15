"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to RoomieSync
        </h1>
        <p className="text-gray-600">Redirecting to login...</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
