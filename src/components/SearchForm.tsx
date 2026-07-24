"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative flex items-center">
      {isOpen ? (
        <form 
          onSubmit={handleSearch}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-background border border-border rounded-full px-3 py-1.5 w-[200px] sm:w-[300px] shadow-sm transition-all duration-300"
        >
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => !query && setIsOpen(false)}
            placeholder="Search products..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </form>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-foreground hover:text-primary transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
