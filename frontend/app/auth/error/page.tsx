"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const [errorType, setErrorType] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const details = searchParams.get("details");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrorType(error || "unknown");
    setErrorDetails(details || "");
  }, [searchParams]);

  const getErrorMessage = () => {
    switch (errorType) {
      case "oauth_expired":
        return {
          title: "Session Expired",
          message:
            "Your login session has expired. This usually happens when you wait too long to complete the authentication.",
          action: "Please try signing in again.",
        };
      case "oauth_failed":
        return {
          title: "Authentication Failed",
          message: "We couldn't complete your authentication request.",
          action: "Please check your internet connection and try again.",
        };
      case "access_denied":
        return {
          title: "Access Denied",
          message: "You denied access to your account information.",
          action:
            "To use Meetink, we need access to your basic profile information.",
        };
      case "server_error":
        return {
          title: "Server Error",
          message:
            "Our servers encountered an error while processing your request.",
          action: "Please try again in a few moments.",
        };
      default:
        return {
          title: "Authentication Error",
          message: "An unexpected error occurred during authentication.",
          action:
            "Please try again or contact support if the problem persists.",
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
            <div className="relative bg-red-500/10 border border-red-500/30 rounded-full p-6">
              <svg
                className="h-12 w-12 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">
            {errorInfo.title}
          </h1>
          <p className="text-gray-400 mb-2">{errorInfo.message}</p>
          <p className="text-gray-500 text-sm">{errorInfo.action}</p>

          {errorDetails && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
                <code className="text-xs text-red-400 break-all">
                  {errorDetails}
                </code>
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/auth/login/google"
            className="block w-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-center"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-800/50 border border-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@meetink.com"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
