"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Product } from "@/lib/excel";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function StarRating({
  rating,
  count,
  interactive = false,
}: {
  rating: number;
  count: number;
  interactive?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-4 h-4"
            style={{
              color:
                star <= Math.round(rating)
                  ? "var(--primary)"
                  : "var(--border-light)",
              fill:
                star <= Math.round(rating)
                  ? "var(--primary)"
                  : "transparent",
            }}
          />
        ))}
      </div>
      <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem" }}>
        {rating.toFixed(1)}
      </span>
      <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
        ({count.toLocaleString()} reviews)
      </span>
    </div>
  );
}

function AccordionTab({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-4 text-left"
        aria-expanded={open}
      >
        <span
          className="font-display font-semibold tracking-wider text-xs uppercase"
          style={{ color: "var(--foreground)", letterSpacing: "0.1em" }}
        >
          {label}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
        ) : (
          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
        )}
      </button>
      {open && (
        <div
          className="pb-5 text-sm leading-relaxed"
          style={{ color: "var(--foreground-muted)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantOption, setSelectedVariantOption] = useState<
    Record<string, string>
  >({});
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();
  const router = useRouter();

  const images =
    product.images.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&h=900&fit=crop",
        ];

  // Compute effective price from selected variant
  let effectivePrice = product.price;
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0];
    const selectedOpt = selectedVariantOption[firstVariant.name];
    if (selectedOpt) {
      const opt = firstVariant.options.find((o) => o.label === selectedOpt);
      if (opt) effectivePrice = opt.price;
    } else if (firstVariant.options.length > 0) {
      effectivePrice = firstVariant.options[0].price;
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    toast.success(`${product.name} added to cart`, {
      description: "✦ Blessed and ready for you",
    });
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };



  const stockStatus =
    product.stock === 0
      ? { label: "Out of Stock", color: "var(--destructive)" }
      : product.stock <= 5
      ? { label: `Only ${product.stock} left`, color: "var(--warning)" }
      : { label: "In Stock", color: "var(--success)" };

  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : null;

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0.75rem 0",
          background: "var(--surface)",
        }}
      >
        <div className="container">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            <Link href="/" style={{ color: "var(--muted-foreground)" }}>Home</Link>
            <span>›</span>
            <Link
              href={`/shop?category=${product.category.toLowerCase()}`}
              style={{ color: "var(--muted-foreground)" }}
            >
              {product.category}
            </Link>
            <span>›</span>
            <span
              style={{
                color: "var(--primary)",
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ════════════════════
              IMAGE GALLERY
          ════════════════════ */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative rounded-2xl overflow-hidden image-zoom-container"
              style={{
                aspectRatio: "4/5",
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <Image
                src={images[selectedImage]}
                alt={`${product.name} — image ${selectedImage + 1}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Glow overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.stock === 0 && (
                  <span className="bg-white/90 border border-gray-300 text-gray-700 px-3 py-1.5 text-xs font-bold rounded shadow-sm flex items-center gap-1 tracking-wide uppercase">
                    Out of Stock / Coming Soon
                  </span>
                )}
                {product.isEnergized && (
                  <span className="badge-energized flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Energized
                  </span>
                )}
                {discountPercent && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(248,113,113,0.2)",
                      border: "1px solid rgba(248,113,113,0.4)",
                      color: "#fca5a5",
                      fontFamily: "'Cinzel', serif",
                    }}
                  >
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className="relative rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200"
                    style={{
                      width: "72px",
                      height: "84px",
                      border: `2px solid ${i === selectedImage ? "var(--primary)" : "var(--border)"}`,
                      boxShadow:
                        i === selectedImage
                          ? "0 0 12px var(--glow-gold)"
                          : "none",
                      background: "var(--surface-2)",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ════════════════════
              PRODUCT INFO
          ════════════════════ */}
          <div className="flex flex-col gap-6">
            {/* Category & badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href={`/shop?category=${product.category.toLowerCase()}`}
                className="text-xs tracking-widest uppercase font-semibold transition-colors"
                style={{
                  color: "var(--muted-foreground)",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.12em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
              >
                {product.category}
              </Link>
              {product.isBestseller && <span className="badge-bestseller">Bestseller</span>}
              {product.isNew && <span className="badge-new">New</span>}
            </div>

            {/* Name */}
            <h1
              className="font-serif font-semibold leading-tight"
              style={{
                color: "var(--foreground)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <StarRating rating={product.rating} count={product.reviewCount} />
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  color: "var(--primary)",
                  letterSpacing: "0.02em",
                }}
              >
                ₹{effectivePrice.toLocaleString("en-IN")}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span
                  className="text-lg line-through"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  ₹{product.comparePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: stockStatus.color }}
              />
              <span className="text-sm font-medium" style={{ color: stockStatus.color }}>
                {stockStatus.label}
              </span>
            </div>

            {/* Ideal For (Tags) */}
            {product.extendedContent?.idealFor && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs font-semibold uppercase tracking-widest flex items-center mr-2" style={{ color: "var(--foreground-muted)", fontFamily: "'Cinzel', serif" }}>
                  Ideal For:
                </span>
                {product.extendedContent.idealFor.map((ideal, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wide uppercase"
                    style={{
                      background: "rgba(201,168,76,0.1)",
                      color: "var(--primary)",
                      border: "1px solid rgba(201,168,76,0.2)"
                    }}
                  >
                    {ideal}
                  </span>
                ))}
              </div>
            )}

            {/* Why Choose Bullets */}
            {product.extendedContent?.whyChoose && (
              <ul className="space-y-1.5 mt-2">
                {product.extendedContent.whyChoose.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "var(--foreground-muted)" }}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Variants */}
            {product.variants && product.variants.map((variant) => (
              <div key={variant.name}>
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-widest"
                  style={{ color: "var(--foreground-muted)", fontFamily: "'Cinzel', serif" }}
                >
                  {variant.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => {
                    const isSelected =
                      selectedVariantOption[variant.name] === opt.label ||
                      (!selectedVariantOption[variant.name] &&
                        variant.options[0].label === opt.label);
                    return (
                      <button
                        key={opt.label}
                        onClick={() =>
                          setSelectedVariantOption((prev) => ({
                            ...prev,
                            [variant.name]: opt.label,
                          }))
                        }
                        disabled={opt.stock === 0}
                        className="px-4 py-2 rounded-full text-sm transition-all duration-200 font-medium"
                        style={{
                          background: isSelected
                            ? "rgba(201,168,76,0.15)"
                            : "var(--surface)",
                          border: `1px solid ${
                            isSelected ? "var(--primary)" : "var(--border)"
                          }`,
                          color: isSelected
                            ? "var(--primary)"
                            : opt.stock === 0
                            ? "var(--muted-foreground)"
                            : "var(--foreground)",
                          boxShadow: isSelected
                            ? "0 0 10px var(--glow-gold)"
                            : "none",
                          opacity: opt.stock === 0 ? 0.5 : 1,
                          textDecoration: opt.stock === 0 ? "line-through" : "none",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {opt.label}
                        {opt.price !== product.price && (
                          <span className="ml-1.5 text-xs opacity-70">
                            ₹{opt.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity & Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Qty selector */}
                <div
                  className="flex items-center gap-1 rounded-full"
                  style={{
                    border: "1px solid var(--border-light)",
                    background: "var(--surface)",
                    padding: "4px",
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      color:
                        quantity <= 1
                          ? "var(--muted-foreground)"
                          : "var(--foreground)",
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span
                    className="w-10 text-center font-semibold"
                    style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    disabled={product.stock > 0 && quantity >= product.stock}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ color: "var(--foreground)" }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>



                {/* Share */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                  aria-label="Share product"
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <Share2 className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                </button>
              </div>

              {/* CTA Buttons */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-2 w-full transition-all duration-300"
                style={{
                  background: addedToCart
                    ? "rgba(74,222,128,0.15)"
                    : "var(--surface-2)",
                  border: `1px solid ${
                    addedToCart ? "rgba(74,222,128,0.4)" : "var(--border-light)"
                  }`,
                  color: addedToCart ? "var(--success)" : "var(--foreground)",
                  padding: "0.9rem",
                  borderRadius: "9999px",
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? "not-allowed" : "pointer",
                }}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-primary flex items-center justify-center gap-2 w-full"
                style={{
                  padding: "0.9rem",
                  borderRadius: "9999px",
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? "not-allowed" : "pointer",
                }}
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>

            {/* Trust block */}
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {product.isEnergized && (
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Ritually Energized & Blessed
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      This product has been energized through a traditional Vedic ceremony by qualified priests before dispatch.
                    </p>
                  </div>
                </div>
              )}

              {product.origin && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Origin & Sourcing
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {product.origin}
                    </p>
                  </div>
                </div>
              )}

              {/* Quality Promise */}
              {product.extendedContent?.qualityPromise && (
                <div className="flex items-start gap-3 mt-4 pt-4" style={{ borderTop: "1px dashed var(--border)" }}>
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Quality Promise
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>
                      {product.extendedContent.qualityPromise}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-2 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  { icon: ShieldCheck, label: "Certified" },
                  { icon: Truck, label: "COD Available" },
                  { icon: RotateCcw, label: "Easy Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(201,168,76,0.1)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accordion Tabs */}
            <div style={{ borderBottom: "1px solid var(--border)" }}>
              <AccordionTab label="Description" defaultOpen>
                <p className="whitespace-pre-wrap">{product.description}</p>
              </AccordionTab>

              {product.extendedContent?.keyBenefits && (
                <AccordionTab label="Key Benefits">
                  <ul className="space-y-2">
                    {product.extendedContent.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Star className="w-3.5 h-3.5 mt-1 flex-shrink-0" style={{ color: "var(--primary)" }} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionTab>
              )}

              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <AccordionTab label="Specifications">
                  <div className="space-y-2">
                    {Object.entries(product.attributes).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-start justify-between gap-4 py-2"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)", fontFamily: "'Cinzel', serif", flexShrink: 0 }}>
                          {k.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-xs text-right" style={{ color: "var(--foreground)" }}>
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionTab>
              )}

              <AccordionTab label="Shipping & Returns">
                <ul className="space-y-2 text-sm" style={{ color: "var(--foreground-muted)" }}>
                  <li>• Free shipping on orders above ₹999 across India</li>
                  <li>• Standard delivery: 5–7 business days</li>
                  <li>• Express delivery available at checkout</li>
                  <li>• Cash on Delivery available for all orders under ₹5,000</li>
                  <li>• Easy returns within 7 days of delivery for unopened items</li>
                  <li>• Energized products are non-returnable due to ritual nature</li>
                </ul>
              </AccordionTab>

              {product.careInstructions && (
                <AccordionTab label="Care Instructions">
                  <p className="whitespace-pre-wrap">{product.careInstructions}</p>
                </AccordionTab>
              )}

              {product.extendedContent?.faqs && (
                <AccordionTab label="FAQ">
                  <div className="space-y-4">
                    {product.extendedContent.faqs.map((faq, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>{faq.question}</p>
                        <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </AccordionTab>
              )}

              <AccordionTab label={`Customer Reviews (${product.reviewCount})`}>
                <div className="space-y-4">
                  {[
                    { name: "Priya S.", rating: 5, text: "Absolutely beautiful. The energy is palpable. Fast shipping and great packaging.", date: "3 weeks ago" },
                    { name: "Rohit M.", rating: 5, text: "Authentic quality. I've been using it daily and it shows. Will order again.", date: "1 month ago" },
                    { name: "Ananya P.", rating: 4, text: "Very nice product. Packaging was premium and the certificate added trust.", date: "2 months ago" },
                  ].map((r, i) => (
                    <div key={i} className="py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{r.name}</span>
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(r.rating)].map((_, s) => (
                          <Star key={s} className="w-3 h-3" style={{ color: "var(--primary)", fill: "var(--primary)" }} />
                        ))}
                      </div>
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </AccordionTab>
            </div>
          </div>
        </div>

        {/* How to Use Block - Prominent */}
        {product.extendedContent?.howToUse && (
          <div className="mt-20 p-8 rounded-3xl" style={{ background: "var(--surface)", border: "1px solid var(--border-light)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 0%, rgba(201,168,76,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
            
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl mb-4" style={{ color: "var(--foreground)" }}>How to Use</h2>
                {product.extendedContent.routine && (
                  <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
                    {product.extendedContent.routine}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.extendedContent.howToUse.map((method, idx) => (
                  <div key={idx} className="p-6 rounded-2xl" style={{ background: "var(--background)", border: "1px dashed var(--border)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)", color: "var(--primary)" }}>
                        <span className="font-serif font-bold text-lg">{idx + 1}</span>
                      </div>
                      <h3 className="font-display font-semibold text-lg tracking-wider uppercase" style={{ color: "var(--primary)" }}>{method.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>{method.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer / Important Note */}
        {product.extendedContent?.disclaimer && (
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="text-xs" style={{ color: "var(--muted-foreground)", fontStyle: "italic", opacity: 0.8 }}>
              <strong>Important Note:</strong> {product.extendedContent.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
