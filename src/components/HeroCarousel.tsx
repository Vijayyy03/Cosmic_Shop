"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    headline: "Ritually Energized\nGemstones & Crystals",
    subtext:
      "Every stone lab-certified, cleansed under the sacred moon, and blessed by Vedic priests before reaching your hands.",
    cta: "Explore Gemstones",
    ctaLink: "/shop?category=gemstone",
    secondaryCta: "Learn Our Process",
    secondaryCtaLink: "/about#energization",
    gradient: "from-[#0d0525] via-[#1a0a40] to-[#07041a]",
    accentColor: "#9b6fa0",
    tag: "New Collection",
    bgImage: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=1600&h=900&fit=crop&q=80",
  },
  {
    id: 2,
    headline: "Sacred Rudraksha\n& Vedic Malas",
    subtext:
      "108 beads of intention — sourced from Nepal's ancient forests, strung by artisans, charged with mantric energy.",
    cta: "Shop Malas",
    ctaLink: "/shop?category=mala",
    secondaryCta: "View Bestsellers",
    secondaryCtaLink: "/shop?category=mala&sort=bestseller",
    gradient: "from-[#050a1a] via-[#0a1530] to-[#07041a]",
    accentColor: "#c9a84c",
    tag: "Ritually Energized",
    bgImage: "https://images.unsplash.com/photo-1602526429747-ac387a91d43b?w=1600&h=900&fit=crop&q=80",
  },
  {
    id: 3,
    headline: "Festival Sale — Up to\n30% Off Select Items",
    subtext:
      "Celebrate with sacred powders, artisan soaps, and gemstone sets — a season of giving and devotion.",
    cta: "Shop the Sale",
    ctaLink: "/shop",
    secondaryCta: "See All Offers",
    secondaryCtaLink: "/shop?sort=sale",
    gradient: "from-[#1a0505] via-[#2a0a10] to-[#07041a]",
    accentColor: "#e6c97a",
    tag: "Festival Offer",
    bgImage: "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=1600&h=900&fit=crop&q=80",
  },
  {
    id: 4,
    headline: "Ayurvedic Soaps &\nSacred Powders",
    subtext:
      "Handcrafted wellness from ancient recipes — pure ingredients, zero synthetics, delivered to your doorstep.",
    cta: "Shop Soaps",
    ctaLink: "/shop?category=soap",
    secondaryCta: "Sacred Powders",
    secondaryCtaLink: "/shop?category=powder",
    gradient: "from-[#0a1205] via-[#0f1a08] to-[#07041a]",
    accentColor: "#a07830",
    tag: "100% Natural",
    bgImage: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1600&h=900&fit=crop&q=80",
  },
  {
    id: 5,
    headline: "Lab-Certified.\nPriest-Blessed.",
    subtext:
      "We don't just sell gemstones — we deliver authenticated, energized sacred objects with certificates of purity and provenance.",
    cta: "Our Certification",
    ctaLink: "/about#certification",
    secondaryCta: "Shop Now",
    secondaryCtaLink: "/shop",
    gradient: "from-[#050d1a] via-[#0a1530] to-[#07041a]",
    accentColor: "#60a5fa",
    tag: "Trust & Authenticity",
    bgImage: "https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=1600&h=900&fit=crop&q=80",
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + SLIDES.length) % SLIDES.length);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, current, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.closest("[data-hero-carousel]")) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setIsPlaying(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPlaying(true);
      return;
    }
    const delta = touchStart - touchEnd;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
    setIsPlaying(true);
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={containerRef}
      data-hero-carousel
      aria-label="Featured promotions carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      className="relative overflow-hidden focus:outline-none"
      style={{ height: "clamp(520px, 82vh, 820px)" }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Live Region for Screen Readers ── */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {current + 1} of {SLIDES.length}: {slide.headline.replace("\n", " ")}
      </div>

      {/* ── Slides ── */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${SLIDES.length}: ${s.headline.replace("\n", " ")}`}
          aria-hidden={i !== current}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: i === current ? "auto" : "none",
          }}
        >
          {/* Background Image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("${s.bgImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: i === current ? "scale(1.03)" : "scale(1)",
              transition: "transform 6s ease-out",
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, rgba(7,4,26,0.95) 0%, rgba(7,4,26,0.75) 50%, rgba(7,4,26,0.5) 100%)`,
            }}
          />

          {/* Star field overlay */}
          <div
            className="star-bg"
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
          />

          {/* Content */}
          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: "4rem",
              paddingBottom: "6rem",
            }}
          >
            {/* Tag badge */}
            <div
              className="inline-flex items-center gap-2 mb-6"
              style={{
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.6s ease 0.15s",
              }}
            >
              <span
                className="section-tag"
                style={{ color: s.accentColor }}
              >
                {s.tag}
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                color: "var(--foreground)",
                maxWidth: "22ch",
                whiteSpace: "pre-line",
                marginBottom: "1.25rem",
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.6s ease 0.25s",
              }}
            >
              <span style={{
                background: `linear-gradient(135deg, #f0eaf8 0%, ${s.accentColor} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {s.headline}
              </span>
            </h2>

            {/* Subtext */}
            <p
              style={{
                fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
                color: "var(--foreground-muted)",
                maxWidth: "48ch",
                lineHeight: 1.75,
                marginBottom: "2.5rem",
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease 0.35s",
              }}
            >
              {s.subtext}
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.6s ease 0.45s",
              }}
            >
              <Link href={s.ctaLink} className="btn-primary" tabIndex={i === current ? 0 : -1}>
                {s.cta}
              </Link>
              <Link
                href={s.secondaryCtaLink}
                className="btn-outline"
                tabIndex={i === current ? 0 : -1}
              >
                {s.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* ── Navigation Arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
        style={{
          background: "rgba(7,4,26,0.7)",
          border: "1px solid var(--border-light)",
          color: "var(--foreground-muted)",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--primary)";
          el.style.color = "var(--primary)";
          el.style.boxShadow = "0 0 16px var(--glow-gold)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--border-light)";
          el.style.color = "var(--foreground-muted)";
          el.style.boxShadow = "none";
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
        style={{
          background: "rgba(7,4,26,0.7)",
          border: "1px solid var(--border-light)",
          color: "var(--foreground-muted)",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--primary)";
          el.style.color = "var(--primary)";
          el.style.boxShadow = "0 0 16px var(--glow-gold)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--border-light)";
          el.style.color = "var(--foreground-muted)";
          el.style.boxShadow = "none";
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dot Indicators ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
        role="tablist"
        aria-label="Slide selector"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              background: i === current ? "var(--primary)" : "rgba(255,255,255,0.25)",
              border: i === current ? "1px solid var(--primary-light)" : "1px solid transparent",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              padding: 0,
              cursor: "pointer",
              boxShadow: i === current ? "0 0 8px var(--glow-gold)" : "none",
            }}
          />
        ))}
      </div>

      {/* ── Progress Bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,255,255,0.08)",
          zIndex: 20,
        }}
      >
        <div
          key={current}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)",
            animation: isPlaying ? `slideProgress ${AUTOPLAY_INTERVAL}ms linear` : "none",
          }}
        />
      </div>

      <style>{`
        @keyframes slideProgress {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
