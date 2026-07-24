"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });

      if (res.ok) {
        toast.success("Welcome back, Admin!");
        router.push("/admin");
        router.refresh(); // Force refresh to update middleware state
      } else {
        toast.error("Invalid password. Please try again.");
      }
    } catch (err) {
      toast.error("Login failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
        <div className="w-16 h-16 mx-auto bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8" style={{ color: "var(--primary)" }} />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Admin Access</h1>
        <p className="text-gray-500 mb-8 text-sm">Enter your secure password to manage the Cosmic Shop.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all text-black"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--primary)] text-white font-medium py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
