"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 
        className="font-display text-8xl md:text-9xl font-black mb-2 opacity-10"
        style={{ color: "var(--primary)" }}
      >
        404
      </h1>
      
      <h2 
        className="font-serif text-3xl font-bold mb-4" 
        style={{ color: "var(--foreground)", marginTop: "-3rem" }}
      >
        Page Not Found
      </h2>
      
      <p 
        className="max-w-md mx-auto mb-10 text-sm md:text-base" 
        style={{ color: "var(--muted-foreground)" }}
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm">
        <Link 
          href="/"
          className="btn-primary w-full sm:w-auto px-8 py-3 rounded-full text-center"
        >
          Return Home
        </Link>
        <Link 
          href="/shop"
          className="btn-ghost w-full sm:w-auto px-8 py-3 rounded-full text-center flex items-center justify-center gap-2 border border-[var(--border)]"
        >
          <Search className="w-4 h-4" /> Browse Shop
        </Link>
      </div>
    </div>
  );
}
