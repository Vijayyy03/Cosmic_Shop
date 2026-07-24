"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },

  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              Cosmic Store
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-gray-900">
              <Search className="w-5 h-5" />
            </button>

            <CartDrawer />
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 p-4 shadow-sm z-40">
            <div className="container mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link key={link.name} href={link.href} className="text-gray-800 font-medium py-2" onClick={() => setMobileOpen(false)}>
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2"></div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
