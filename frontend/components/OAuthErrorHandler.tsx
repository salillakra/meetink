/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthErrorHandler() {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      let message = "";

      switch (error) {
        case "oauth_expired":
          message = "Your login session expired. Please try signing in again.";
          break;
        case "oauth_failed":
          message = "Authentication failed. Please try again.";
          break;
        case "oauth_cancelled":
          message =
            "Login was cancelled. You can try again whenever you're ready.";
          break;
        default:
          message =
            "An error occurred during authentication. Please try again.";
      }

      setErrorMessage(message);
      setShowError(true);

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowError(false);
        // Clean up URL after hiding
        setTimeout(() => {
          router.replace("/");
        }, 300);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!showError) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-6 py-4 backdrop-blur-sm shadow-lg max-w-md">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-300 mb-1">
              Authentication Error
            </h3>
            <p className="text-sm text-red-200/90">{errorMessage}</p>
          </div>
          <button
            onClick={() => setShowError(false)}
            className="shrink-0 text-red-300/70 hover:text-red-200 transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
