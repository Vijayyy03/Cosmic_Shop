"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  const { items, removeItem, updateQuantity, getCartTotal, getCartCount, isOpen, openCart, closeCart } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-900 relative"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="w-5 h-5" />
      </button>
    );
  }

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const freeShippingThreshold = 999;
  const remaining = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <>
      {/* Cart Trigger Button */}
      <button
        onClick={() => openCart()}
        aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
        aria-expanded={isOpen}
        className="p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] rounded-full bg-black text-white text-[10px] font-bold px-1">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => closeCart()}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className="fixed top-0 right-0 h-full z-[100] flex flex-col w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
              <ShoppingCart className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
              <p className="text-sm text-gray-500">
                {cartCount} item{cartCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => closeCart()}
            aria-label="Close cart"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cartCount > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            {remaining > 0 ? (
              <p className="text-sm text-gray-600 mb-2">
                Add <span className="font-bold text-gray-900">₹{remaining}</span> more for free shipping
              </p>
            ) : (
              <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                <Truck className="w-4 h-4" /> You qualify for free shipping!
              </p>
            )}
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button
                onClick={() => closeCart()}
                className="bg-black text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors mt-2"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                {/* Image */}
                <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={item.product.images?.[0] || "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=200&h=240&fit=crop"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {item.product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-3 border border-gray-300 rounded-md p-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-gray-500 hover:text-black transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-black transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-5">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium uppercase tracking-wide text-sm">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-center text-gray-500">
              Taxes & shipping calculated at checkout
            </p>

            {/* Trust micro-badges */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-black" />
                Secure Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-black" />
                Fast Delivery
              </span>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={() => closeCart()}
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-3.5 rounded-md font-bold text-sm hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
