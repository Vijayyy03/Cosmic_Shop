"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Tag,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const router = useRouter();

  const subtotal = getCartTotal();
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal - discount + shipping;
  const count = getCartCount();

  const handlePromo = () => {
    if (promoCode.toUpperCase() === "COSMIC10") {
      setPromoApplied(true);
      toast.success("Promo code applied! 10% off");
    } else {
      toast.error("Invalid promo code");
    }
  };

  if (items.length === 0) {
    return (
      <div
        style={{
          background: "var(--background)",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "4rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "var(--surface)", border: "2px dashed var(--border-light)" }}
        >
          <ShoppingCart className="w-9 h-9" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Your cart is empty
          </h1>
          <p style={{ color: "var(--muted-foreground)" }}>
            Explore our sacred collection and add something meaningful.
          </p>
        </div>
        <Link href="/shop" className="btn-primary" style={{ padding: "0.75rem 2rem" }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0.75rem 0" }}>
        <div className="container">
          <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <Link href="/" style={{ color: "var(--muted-foreground)" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "var(--primary)" }}>Cart</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
        <h1
          className="font-serif font-semibold mb-8"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "var(--foreground)" }}
        >
          Shopping Cart
          <span className="ml-3 text-base font-normal" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>
            ({count} {count === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-5 p-5 rounded-2xl"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {/* Image */}
                <Link href={`/product/${item.product.slug}`}>
                  <div
                    className="relative rounded-xl overflow-hidden flex-shrink-0"
                    style={{ width: "96px", height: "112px", background: "var(--surface-2)", border: "1px solid var(--border)" }}
                  >
                    <Image
                      src={item.product.images?.[0] || "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=200&h=240&fit=crop"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-wider uppercase mb-1" style={{ color: "var(--muted-foreground)", fontFamily: "'Cinzel', serif" }}>
                      {item.product.category}
                    </p>
                    <Link href={`/product/${item.product.slug}`}>
                      <h3
                        className="font-serif font-medium leading-snug transition-colors"
                        style={{ color: "var(--foreground)", fontSize: "1rem" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                      >
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.isEnergized && (
                      <span className="badge-energized mt-1.5 inline-flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Energized
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Quantity */}
                    <div
                      className="flex items-center gap-1 rounded-full p-0.5"
                      style={{ border: "1px solid var(--border-light)", background: "var(--surface-2)" }}
                    >
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ color: "var(--muted-foreground)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ color: "var(--muted-foreground)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold" style={{ color: "var(--primary)", fontFamily: "'Inter', sans-serif", fontSize: "1.05rem" }}>
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: "var(--muted-foreground)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--destructive)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Back to shop */}
            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm transition-colors mt-4"
              style={{ color: "var(--muted-foreground)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2
                className="font-display font-semibold tracking-wider mb-6 pb-4"
                style={{ color: "var(--foreground)", borderBottom: "1px solid var(--border)", fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                Order Summary
              </h2>

              {/* Promo code */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Promo code (COSMIC10)"
                      className="form-input"
                      style={{ paddingLeft: "2.5rem" }}
                      disabled={promoApplied}
                      onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                    />
                  </div>
                  <button
                    onClick={handlePromo}
                    disabled={promoApplied || !promoCode}
                    className="btn-outline flex-shrink-0"
                    style={{ padding: "0 1rem", fontSize: "0.7rem", opacity: promoApplied ? 0.6 : 1 }}
                  >
                    {promoApplied ? "Applied ✓" : "Apply"}
                  </button>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between" style={{ color: "var(--foreground-muted)" }}>
                  <span>Subtotal ({count} items)</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between" style={{ color: "var(--success)" }}>
                    <span>Discount (10%)</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ color: "var(--foreground-muted)" }}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span style={{ color: "var(--success)" }}>Free</span> : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for free shipping
                  </p>
                )}
              </div>

              <div
                className="flex justify-between items-center py-4 mb-5"
                style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
              >
                <span className="font-display font-bold tracking-wider text-sm" style={{ color: "var(--foreground)", textTransform: "uppercase" }}>Total</span>
                <span className="font-display font-bold text-2xl" style={{ color: "var(--primary)" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mb-5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" style={{ color: "var(--primary)" }} /> Secure</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" style={{ color: "var(--primary)" }} /> Energized</span>
                <span className="flex items-center gap-1"><Truck className="w-3 h-3" style={{ color: "var(--primary)" }} /> COD OK</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="btn-primary w-full flex items-center justify-center gap-2"
                style={{ padding: "1rem", fontSize: "0.78rem" }}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-center mt-3" style={{ color: "var(--muted-foreground)" }}>
                Taxes included · Free returns within 7 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
