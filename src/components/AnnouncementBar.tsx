"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const MESSAGES = [
  { text: "✦ Free shipping on orders above ₹999 across India", link: null },
  { text: "✦ Festival Sale Live — Up to 30% off on select Malas & Gemstones", link: "/shop" },
  { text: "✦ All gemstones are lab-certified & ritually energized before dispatch", link: null },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % MESSAGES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + MESSAGES.length) % MESSAGES.length);
  }, []);

  // Check session storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const d = sessionStorage.getItem("announcement-dismissed");
      if (d === "true") setDismissed(true);
    }
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(next, 3500);
    return () => clearInterval(interval);
  }, [dismissed, next]);

  const dismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("announcement-dismissed", "true");
    }
  };

  if (dismissed) return null;

  const msg = MESSAGES[current];

  return (
    <div
      role="banner"
      style={{
        background: "linear-gradient(90deg, #0d0720 0%, #160e30 50%, #0d0720 100%)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        zIndex: 60,
      }}
    >
      <div className="container" style={{ padding: "0.5rem 1.5rem" }}>
        <div className="flex items-center justify-between gap-2">
          {/* Prev */}
          <button
            onClick={prev}
            aria-label="Previous announcement"
            className="p-1 transition-colors"
            style={{ color: "var(--primary-dark)", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-dark)")}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Message */}
          <div className="flex-1 text-center overflow-hidden">
            {msg.link ? (
              <a
                href={msg.link}
                className="block text-xs font-medium tracking-wide transition-colors"
                style={{ color: "var(--primary)", fontFamily: "'Cinzel', serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary)")}
              >
                {msg.text}
              </a>
            ) : (
              <span
                className="text-xs font-medium tracking-wide"
                style={{ color: "var(--primary)", fontFamily: "'Cinzel', serif" }}
              >
                {msg.text}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
            {/* Dots */}
            <div className="hidden sm:flex items-center gap-1">
              {MESSAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Announcement ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: i === current ? "14px" : "5px",
                    height: "5px",
                    borderRadius: "9999px",
                    background: i === current ? "var(--primary)" : "var(--border-light)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next announcement"
              className="p-1 transition-colors"
              style={{ color: "var(--primary-dark)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-dark)")}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Dismiss announcement"
              className="p-1 transition-colors ml-1"
              style={{ color: "var(--muted-foreground)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
