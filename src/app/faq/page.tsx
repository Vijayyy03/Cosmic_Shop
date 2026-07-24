"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does shipping take?", a: "Most orders are processed within 24-48 hours. Delivery takes 3-5 business days depending on your location in India." },
      { q: "Do you offer Cash on Delivery (COD)?", a: "Yes, we offer Cash on Delivery across India for orders up to ₹5,000." },
      { q: "Can I track my order?", a: "Once your order is shipped, you will receive a tracking link via email and SMS." }
    ]
  },
  {
    category: "Products & Authenticity",
    items: [
      { q: "Are your gemstones certified?", a: "Absolutely. Every gemstone comes with a certificate of authenticity from a reputed gemological laboratory." },
      { q: "What does 'ritually energized' mean?", a: "Before shipping, each item undergoes a traditional Vedic consecration process (pran pratishtha) to awaken its intended cosmic energy." },
      { q: "How should I care for my Rudraksha?", a: "We recommend conditioning it with ghee or oil once every few months and keeping it away from harsh chemicals." }
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for damaged or defective items. Due to the spiritual nature of our products, we cannot accept returns for items that have been used." },
      { q: "How do I initiate a return?", a: "Please contact us at info.shivcosmic@gmail.com with your order number and photos of the item." }
    ]
  }
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = FAQ_DATA.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.q.toLowerCase().includes(search.toLowerCase()) || 
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <div
        style={{
          background: "linear-gradient(180deg, #0d0720 0%, var(--background) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <p className="section-tag" style={{ justifyContent: "center", marginBottom: "1rem" }}>Support</p>
        <h1
          className="font-serif font-semibold mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--foreground)", lineHeight: 1.15 }}
        >
          Frequently Asked <span className="text-gradient-gold">Questions</span>
        </h1>
        
        <div className="max-w-md mx-auto relative mt-8">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input w-full"
            style={{ paddingLeft: "3rem", paddingRight: "1.5rem", borderRadius: "9999px" }}
          />
        </div>
      </div>

      <div className="container" style={{ padding: "4rem 1.5rem 6rem", maxWidth: "800px" }}>
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: "var(--muted-foreground)" }}>No results found for "{search}".</p>
            <p className="mt-2 text-sm">
              Can't find what you're looking for? <Link href="/contact" className="hover:underline" style={{ color: "var(--primary)" }}>Contact us</Link>.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredData.map((category, idx) => (
              <div key={idx}>
                <h2 className="font-display font-semibold text-xs tracking-wider uppercase mb-6" style={{ color: "var(--primary)", letterSpacing: "0.1em" }}>
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.items.map((item, itemIdx) => {
                    const id = `${idx}-${itemIdx}`;
                    const isOpen = openItems.includes(id);
                    return (
                      <div key={itemIdx} className="glass-card overflow-hidden transition-all duration-300">
                        <button
                          onClick={() => toggleItem(id)}
                          className="w-full flex items-center justify-between p-5 text-left"
                        >
                          <span className="font-semibold text-sm pr-8" style={{ color: "var(--foreground)" }}>{item.q}</span>
                          <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} style={{ color: "var(--primary)" }} />
                        </button>
                        <div
                          className="px-5 overflow-hidden transition-all duration-300 ease-in-out"
                          style={{
                            maxHeight: isOpen ? "200px" : "0px",
                            paddingBottom: isOpen ? "1.25rem" : "0px",
                            opacity: isOpen ? 1 : 0
                          }}
                        >
                          <p className="text-sm" style={{ color: "var(--foreground-muted)", lineHeight: 1.6 }}>{item.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
