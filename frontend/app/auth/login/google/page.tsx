"use client";

import { useEffect } from "react";

export default function GoogleLoginRedirect() {
  useEffect(() => {
    // Redirect to backend OAuth endpoint
    window.location.href = "http://localhost:8000/auth/login/google";
  }, []);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-400">Redirecting to Google Sign In...</p>
      </div>
    </main>
  );
}
