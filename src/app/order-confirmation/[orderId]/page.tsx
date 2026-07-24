import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  Star,
  ArrowRight,
  MessageCircle,
  Home,
} from "lucide-react";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 6);
  const dateStr = estimatedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const TIMELINE = [
    {
      icon: CheckCircle2,
      label: "Order Confirmed",
      sub: "Your order has been received",
      done: true,
    },
    {
      icon: Package,
      label: "Packing & Energizing",
      sub: "Products are being packed with care",
      done: false,
    },
    {
      icon: Truck,
      label: "Shipped",
      sub: "Your order is on its way",
      done: false,
    },
    {
      icon: Home,
      label: "Delivered",
      sub: `Expected by ${dateStr}`,
      done: false,
    },
  ];

  return (
    <div
      className="star-bg"
      style={{
        background: "var(--background)",
        minHeight: "100vh",
        padding: "5rem 1.5rem",
        position: "relative",
      }}
    >
      <div
        style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 20%, rgba(201,168,76,0.06) 0%, transparent 60%)", pointerEvents: "none", zIndex: 1 }}
      />

      <div
        className="container"
        style={{ maxWidth: "600px", position: "relative", zIndex: 2 }}
      >
        {/* Success icon */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-pulse-gold"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%)",
              border: "2px solid var(--primary)",
              boxShadow: "0 0 32px var(--glow-gold)",
            }}
          >
            <CheckCircle2 className="w-10 h-10" style={{ color: "var(--primary)" }} />
          </div>

          <p
            className="font-display font-semibold tracking-widest uppercase text-xs mb-3"
            style={{ color: "var(--primary)", letterSpacing: "0.2em" }}
          >
            Order Placed Successfully
          </p>
          <h1
            className="font-serif font-semibold mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "var(--foreground)", lineHeight: 1.2 }}
          >
            Thank you for your<br />
            <span className="text-gradient-gold">Sacred Purchase</span>
          </h1>
          <p style={{ color: "var(--muted-foreground)", lineHeight: 1.75 }}>
            Your order is confirmed and will be packed with devotion. You&apos;ll receive an email confirmation shortly.
          </p>
        </div>

        {/* Order number card */}
        <div
          className="glass-card p-6 text-center mb-8"
        >
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--muted-foreground)", fontFamily: "'Cinzel', serif", letterSpacing: "0.15em" }}>
            Order Number
          </p>
          <p
            className="font-display font-bold text-3xl mb-1"
            style={{ color: "var(--primary)", letterSpacing: "0.1em" }}
          >
            #{orderId}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Save this number for tracking
          </p>
        </div>

        {/* Delivery timeline */}
        <div
          className="glass-card p-6 mb-8"
        >
          <h2
            className="font-display font-semibold tracking-wider text-xs uppercase mb-6"
            style={{ color: "var(--foreground)", letterSpacing: "0.12em" }}
          >
            What Happens Next
          </h2>

          <div className="space-y-0">
            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: step.done
                          ? "linear-gradient(135deg, var(--primary) 0%, var(--copper) 100%)"
                          : "var(--surface-2)",
                        border: `2px solid ${step.done ? "var(--primary)" : "var(--border)"}`,
                        boxShadow: step.done ? "0 0 12px var(--glow-gold)" : "none",
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{
                          color: step.done ? "var(--primary-foreground)" : "var(--muted-foreground)",
                        }}
                      />
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div
                        className="w-px flex-1 my-1"
                        style={{
                          background: step.done ? "var(--primary)" : "var(--border)",
                          minHeight: "28px",
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-5">
                    <p
                      className="font-semibold text-sm"
                      style={{
                        color: step.done ? "var(--primary)" : "var(--foreground)",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.75rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {step.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Energized notice */}
        <div
          className="rounded-2xl p-5 text-center mb-8"
          style={{
            background: "rgba(201,168,76,0.06)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <Star className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--primary)" }} />
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--primary)", fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Energization Notice
          </p>
          <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
            Energized products in your order will undergo a final blessing ceremony before packing. This ensures maximum spiritual potency when they reach you.
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground-muted)",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.08em",
              fontSize: "0.72rem",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href="https://wa.me/917030127129?text=Hello%2C%20I%20want%20to%20track%20my%20order%20%23"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              color: "#fff",
              textDecoration: "none",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.08em",
              fontSize: "0.72rem",
              textTransform: "uppercase",
            }}
          >
            <MessageCircle className="w-3.5 h-3.5" /> Track on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
