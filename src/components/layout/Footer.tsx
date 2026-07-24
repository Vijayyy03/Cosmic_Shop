"use client";

import Link from "next/link";
import { Camera, Globe, MessageCircle, Video, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
              Cosmic Store
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-sm">
              Your one-stop shop for everything you need. Quality products delivered to your door with love and care.
            </p>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Subscribe to our newsletter</h4>
              <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/shop" className="hover:text-black transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=new" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?category=bestsellers" className="hover:text-black transition-colors">Bestsellers</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-black transition-colors">Accessories</Link></li>
              <li><Link href="/journal" className="hover:text-black transition-colors">Our Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/faq" className="hover:text-black transition-colors">Help & FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="/returns" className="hover:text-black transition-colors">Returns & Exchanges</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href="tel:+917030127129" className="hover:text-black transition-colors">+91 7030127129</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href="mailto:info.shivcosmic@gmail.com" className="hover:text-black transition-colors">info.shivcosmic@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Pune, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" aria-label="Instagram" className="hover:text-gray-900 transition-colors"><Camera className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gray-900 transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-900 transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="#" aria-label="Youtube" className="hover:text-gray-900 transition-colors"><Video className="w-5 h-5" /></a>
          </div>
          
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Cosmic Store. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
            <Link href="/returns" className="hover:text-black transition-colors">Refund Policy</Link>
            <Link href="/admin/login" className="hover:text-black transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
