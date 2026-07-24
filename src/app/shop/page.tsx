import { Metadata } from "next";
import { getProducts } from "@/lib/excel";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import {
  SearchX,
  Gem,
  Crown,
  FlaskConical,
  Waves,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

export const revalidate = 60;

const CATEGORIES = [
  { key: "ALL", label: "All Products", icon: Sparkles },
  { key: "GEMSTONE", label: "Gemstones", icon: Gem },
  { key: "MALA", label: "Vedic Malas", icon: Crown },
  { key: "POWDER", label: "Sacred Powders", icon: FlaskConical },
  { key: "SOAP", label: "Artisan Soaps", icon: Waves },
];

const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
  { key: "newest", label: "Newest" },
];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { category, q } = await searchParams;
  const cat = category ? String(category).toLowerCase() : null;
  if (q) {
    return {
      title: `Search: "${q}"`,
      description: `Browse search results for "${q}" on Cosmic Shop.`,
    };
  }
  if (cat && cat !== "all") {
    const catMeta: Record<string, { title: string; description: string }> = {
      gemstone: { title: "Natural Gemstones — Lab-Certified & Energized", description: "Shop lab-certified, ritually energized natural gemstones: amethyst, rose quartz, black tourmaline, and more." },
      mala: { title: "Vedic Malas — Rudraksha & Sacred Beads", description: "Authentic 108-bead Rudraksha and crystal malas, energized with Vedic mantras before dispatch." },
      powder: { title: "Sacred Powders — Kumkum, Haldi & Bhasma", description: "Pure ritual powders: kumkum, vibhuti, haldi, chandan — prepared the traditional way." },
      soap: { title: "Ayurvedic Artisan Soaps — Handmade Wellness", description: "Cold-process handmade soaps with natural ingredients: neem, turmeric, rose, sandalwood, charcoal." },
    };
    const m = catMeta[cat];
    if (m) return { title: m.title, description: m.description };
  }
  return {
    title: "Shop All — Sacred Gemstones, Malas, Powders & Soaps",
    description: "Browse our full collection of spiritual and wellness products, all certified and crafted with intention.",
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, q, sort, energized, instock } = await searchParams;

  const allProducts = await getProducts();
  let filtered = [...allProducts];

  // ── Filters ──────────────────────────────────────────────
  const currentCat = category
    ? String(category).toUpperCase()
    : "ALL";

  if (currentCat !== "ALL") {
    filtered = filtered.filter(
      (p) => p.category.toUpperCase() === currentCat
    );
  }

  if (q && typeof q === "string") {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
    );
  }

  if (energized === "1") {
    filtered = filtered.filter((p) => p.isEnergized);
  }

  if (instock === "1") {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  // ── Sort ─────────────────────────────────────────────────
  const currentSort = (sort as string) || "featured";
  if (currentSort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (currentSort === "newest") {
    filtered = filtered.filter((p) => p.isNew).concat(filtered.filter((p) => !p.isNew));
  } else {
    // Featured: bestsellers first
    filtered = filtered.filter((p) => p.isBestseller).concat(filtered.filter((p) => !p.isBestseller));
  }

  // ── Build filter URL helper ───────────────────────────────
  function buildUrl(overrides: Record<string, string | undefined>) {
    const base: Record<string, string> = {};
    if (currentCat !== "ALL") base.category = currentCat.toLowerCase();
    if (q) base.q = String(q);
    if (currentSort !== "featured") base.sort = currentSort;
    if (energized === "1") base.energized = "1";
    if (instock === "1") base.instock = "1";
    const merged = { ...base, ...overrides };
    // Remove undefined keys
    Object.keys(merged).forEach((k) => { if (merged[k] === undefined) delete merged[k]; });
    const qs = new URLSearchParams(merged as Record<string, string>).toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  }

  const headingMap: Record<string, string> = {
    ALL: "Shop All",
    GEMSTONE: "Natural Gemstones",
    MALA: "Vedic Malas",
    POWDER: "Sacred Powders",
    SOAP: "Artisan Soaps",
  };
  const heading = q
    ? `Search: "${q}"`
    : headingMap[currentCat] ?? currentCat;

  const hasActiveFilters = currentCat !== "ALL" || energized === "1" || instock === "1" || (q && String(q).trim());

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0.75rem 0", background: "var(--surface)" }}>
        <div className="container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <Link href="/" className="hover:text-primary transition-colors" style={{ color: "var(--muted-foreground)" }}>
              Home
            </Link>
            <span>›</span>
            <span style={{ color: currentCat === "ALL" ? "var(--primary)" : "var(--muted-foreground)" }}>Shop</span>
            {currentCat !== "ALL" && (
              <>
                <span>›</span>
                <span style={{ color: "var(--primary)" }}>{headingMap[currentCat] ?? currentCat}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1.5rem" }}>
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ════════════════════
              SIDEBAR FILTERS
          ════════════════════ */}
          <aside
            className="lg:w-64 flex-shrink-0"
            aria-label="Product filters"
          >
            {/* Categories */}
            <div className="glass-card p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4" style={{ color: "var(--primary)" }} />
                <h3 className="font-display font-semibold text-xs tracking-widest uppercase" style={{ color: "var(--foreground)" }}>
                  Categories
                </h3>
              </div>
              <ul className="space-y-1">
                {CATEGORIES.map(({ key, label, icon: Icon }) => {
                  const isActive = currentCat === key;
                  return (
                    <li key={key}>
                      <Link
                        href={buildUrl({ category: key === "ALL" ? undefined : key.toLowerCase(), q: q as string | undefined })}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm"
                        style={{
                          background: isActive ? "rgba(201,168,76,0.12)" : "transparent",
                          border: `1px solid ${isActive ? "rgba(201,168,76,0.3)" : "transparent"}`,
                          color: isActive ? "var(--primary)" : "var(--foreground-muted)",
                          fontWeight: isActive ? 600 : 400,
                          fontFamily: "'Cinzel', serif",
                          letterSpacing: "0.05em",
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

          </aside>

          {/* ════════════════════
              PRODUCT GRID
          ════════════════════ */}
          <div className="flex-1">
            {/* Header row */}
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <h1
                  className="font-serif font-semibold"
                  style={{ color: "var(--foreground)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                >
                  {heading}
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {filtered.length} {filtered.length === 1 ? "product" : "products"}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                <div className="flex flex-wrap gap-1">
                  {SORT_OPTIONS.map(({ key, label }) => {
                    const isActive = currentSort === key;
                    return (
                      <Link
                        key={key}
                        href={buildUrl({ sort: key === "featured" ? undefined : key })}
                        className="text-xs px-3 py-1.5 rounded-full transition-all"
                        style={{
                          background: isActive ? "rgba(201,168,76,0.15)" : "var(--surface)",
                          border: `1px solid ${isActive ? "rgba(201,168,76,0.4)" : "var(--border)"}`,
                          color: isActive ? "var(--primary)" : "var(--foreground-muted)",
                          fontFamily: "'Cinzel', serif",
                          letterSpacing: "0.05em",
                          fontWeight: isActive ? 600 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>



            {/* Empty state */}
            {filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 rounded-2xl text-center"
                style={{
                  border: "1px dashed var(--border-light)",
                  background: "var(--surface)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "var(--muted)", border: "2px dashed var(--border-light)" }}
                >
                  <SearchX className="w-7 h-7" style={{ color: "var(--muted-foreground)", opacity: 0.5 }} />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2" style={{ color: "var(--foreground-muted)" }}>
                  No products found
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
                  Try adjusting your filters or search terms.
                </p>
                <Link href="/shop" className="btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.7rem" }}>
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
