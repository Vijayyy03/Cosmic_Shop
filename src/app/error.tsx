"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
      >
        <AlertCircle className="w-8 h-8" />
      </div>
      
      <h2 
        className="font-serif text-3xl font-bold mb-4" 
        style={{ color: "var(--foreground)" }}
      >
        Oops! Something went wrong
      </h2>
      
      <p 
        className="max-w-md mx-auto mb-8 text-sm md:text-base" 
        style={{ color: "var(--muted-foreground)" }}
      >
        We apologize for the inconvenience. An unexpected error has occurred while trying to load this page.
      </p>
      
      <button
        onClick={reset}
        className="btn-primary flex items-center gap-2 px-8 py-3 rounded-full hover:scale-105 transition-transform"
      >
        <RefreshCcw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}
