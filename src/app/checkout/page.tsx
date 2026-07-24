"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Truck,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowLeft,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required").max(15),
});

const addressSchema = z.object({
  address: z.string().min(5, "Street address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().min(6, "Valid pincode required").max(6),
  country: z.string(),
});

const fullSchema = contactSchema.merge(addressSchema);
type FormValues = z.infer<typeof fullSchema>;

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Shipping" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Review" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = current > step.number;
        const active = current === step.number;
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300"
                style={{
                  background: done
                    ? "var(--primary)"
                    : active
                    ? "linear-gradient(135deg, var(--primary) 0%, var(--copper) 100%)"
                    : "var(--surface-2)",
                  border: active
                    ? "2px solid var(--primary)"
                    : done
                    ? "2px solid var(--primary)"
                    : "2px solid var(--border)",
                  color: done || active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  boxShadow: active ? "0 0 16px var(--glow-gold)" : "none",
                }}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : step.number}
              </div>
              <span
                className="text-xs font-semibold tracking-wider uppercase hidden sm:block"
                style={{
                  color: active ? "var(--primary)" : done ? "var(--foreground-muted)" : "var(--muted-foreground)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.62rem",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-16 sm:w-24 h-px mx-2"
                style={{
                  background: done
                    ? "var(--primary)"
                    : "var(--border)",
                  transition: "background 0.3s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Payment Methods ──────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    sub: "Pay when your order arrives",
    icon: Banknote,
  },
  {
    id: "online",
    label: "Pay Online",
    sub: "UPI, Credit/Debit Cards, Netbanking",
    icon: CreditCard,
  }
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, getCartTotal, getCartCount, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fullSchema),
    defaultValues: { country: "India" },
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger(["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const onSubmit = async (data: any) => {
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setIsSubmitting(true);
    
    try {
      const orderPayload = {
        contactInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
        shippingAddress: {
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
        },
        items,
        paymentMethod,
        subtotal,
        shipping,
        total,
      };

      if (paymentMethod === "online") {
        // Razorpay flow
        const rzpResponse = await fetch("/api/razorpay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        
        if (!rzpResponse.ok) throw new Error("Failed to initialize payment");
        const rzpOrder = await rzpResponse.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_key_here", // Add to public env if possible, or leave blank and backend handles it? Actually Razorpay needs key on frontend.
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Shiv Cosmic Shop",
          description: "Order Payment",
          order_id: rzpOrder.id,
          handler: async function (response: any) {
            // Payment success - verify and save order
            try {
              const finalizeResponse = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...orderPayload,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              
              if (!finalizeResponse.ok) throw new Error("Verification failed");
              const result = await finalizeResponse.json();
              clearCart();
              router.push(`/order-confirmation/${result.orderId}`);
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#c9a84c", // Primary gold
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
           toast.error("Payment failed. Please try again.");
        });
        rzp.open();
        setIsSubmitting(false); // Enable button again since modal is open
        return;
      }

      // COD flow
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const result = await response.json();
      
      clearCart();
      router.push(`/order-confirmation/${result.orderId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step < 3) {
    return (
      <div className="container" style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <h1 className="font-serif text-3xl mb-4" style={{ color: "var(--foreground)" }}>Checkout</h1>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  const formValues = getValues();

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0.75rem 0" }}>
        <div className="container">
          <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <Link href="/">Home</Link> <span>›</span>
            <Link href="/cart">Cart</Link> <span>›</span>
            <span style={{ color: "var(--primary)" }}>Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
        <h1 className="font-serif font-semibold mb-2 text-center" style={{ color: "var(--foreground)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
          Checkout
        </h1>
        <p className="text-center mb-8 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Guest checkout — no account required
        </p>

        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* ── STEP 1: Shipping ── */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-up">
                  {/* Contact Info */}
                  <div
                    className="rounded-2xl p-6 space-y-5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" style={{ color: "var(--primary)" }} />
                      <h2 className="font-display font-semibold tracking-wider text-xs uppercase" style={{ color: "var(--foreground)", letterSpacing: "0.12em" }}>
                        Contact Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">First Name</label>
                        <input {...register("firstName")} className="form-input" placeholder="Aarav" />
                        {errors.firstName && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">Last Name</label>
                        <input {...register("lastName")} className="form-input" placeholder="Sharma" />
                        {errors.lastName && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">
                          <Mail className="w-3 h-3 inline mr-1" />Email
                        </label>
                        <input type="email" {...register("email")} className="form-input" placeholder="you@example.com" />
                        {errors.email && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">
                          <Phone className="w-3 h-3 inline mr-1" />Phone
                        </label>
                        <input type="tel" {...register("phone")} className="form-input" placeholder="+91 98765 43210" />
                        {errors.phone && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div
                    className="rounded-2xl p-6 space-y-5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" style={{ color: "var(--primary)" }} />
                      <h2 className="font-display font-semibold tracking-wider text-xs uppercase" style={{ color: "var(--foreground)", letterSpacing: "0.12em" }}>
                        Shipping Address
                      </h2>
                    </div>

                    <div>
                      <label className="form-label">Street Address</label>
                      <input {...register("address")} className="form-input" placeholder="42, MG Road, Apartment 3B" />
                      {errors.address && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">City</label>
                        <input {...register("city")} className="form-input" placeholder="Mumbai" />
                        {errors.city && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">State</label>
                        <input {...register("state")} className="form-input" placeholder="Maharashtra" />
                        {errors.state && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.state.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">PIN Code</label>
                        <input {...register("pincode")} className="form-input" placeholder="400001" maxLength={6} />
                        {errors.pincode && <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>{errors.pincode.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">Country</label>
                        <input {...register("country")} className="form-input" defaultValue="India" />
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2" style={{ padding: "1rem", fontSize: "0.78rem" }}>
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── STEP 2: Payment ── */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-up">
                  <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                    Choose Payment Method
                  </h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                        style={{
                          background: paymentMethod === id ? "rgba(201,168,76,0.08)" : "var(--surface)",
                          border: `2px solid ${paymentMethod === id ? "var(--primary)" : "var(--border)"}`,
                          boxShadow: paymentMethod === id ? "0 0 16px var(--glow-gold)" : "none",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: paymentMethod === id ? "rgba(201,168,76,0.15)" : "var(--surface-2)",
                            border: `1px solid ${paymentMethod === id ? "rgba(201,168,76,0.4)" : "var(--border)"}`,
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: paymentMethod === id ? "var(--primary)" : "var(--muted-foreground)" }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm" style={{ color: paymentMethod === id ? "var(--primary)" : "var(--foreground)", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                            {label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{sub}</p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: paymentMethod === id ? "var(--primary)" : "var(--border)" }}
                        >
                          {paymentMethod === id && (
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--primary)" }} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>



                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="btn-ghost flex items-center gap-2 flex-1" style={{ border: "1px solid var(--border)", borderRadius: "9999px", padding: "0.75rem" }}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={handleNext} className="btn-primary flex items-center justify-center gap-2 flex-1" style={{ padding: "0.75rem" }}>
                      Review Order <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Review ── */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-up">
                  <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                    Review Your Order
                  </h2>

                  {/* Shipping summary */}
                  <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: "var(--primary)" }} />
                        <span className="font-display font-semibold text-xs tracking-wider uppercase" style={{ color: "var(--foreground)" }}>Shipping To</span>
                      </div>
                      <button type="button" onClick={() => setStep(1)} className="text-xs" style={{ color: "var(--primary)", fontFamily: "'Cinzel', serif" }}>Edit</button>
                    </div>
                    <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                      {formValues.firstName} {formValues.lastName}<br />
                      {formValues.address}, {formValues.city}, {formValues.state} — {formValues.pincode}<br />
                      {formValues.phone} · {formValues.email}
                    </p>
                  </div>

                  {/* Payment summary */}
                  <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" style={{ color: "var(--primary)" }} />
                        <span className="font-display font-semibold text-xs tracking-wider uppercase" style={{ color: "var(--foreground)" }}>Payment</span>
                      </div>
                      <button type="button" onClick={() => setStep(2)} className="text-xs" style={{ color: "var(--primary)", fontFamily: "'Cinzel', serif" }}>Edit</button>
                    </div>
                    <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                      {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(2)} className="btn-ghost flex items-center gap-2 flex-shrink-0" style={{ border: "1px solid var(--border)", borderRadius: "9999px", padding: "0.75rem 1.5rem" }}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex items-center justify-center gap-2 flex-1"
                      style={{ padding: "1rem", fontSize: "0.78rem", opacity: isSubmitting ? 0.7 : 1 }}
                    >
                      {isSubmitting ? (
                        <><span className="loading-dots">Processing</span></>
                      ) : (
                        <>Place Order — ₹{total.toLocaleString("en-IN")} <CheckCircle2 className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h3 className="font-display font-semibold tracking-wider text-xs uppercase mb-5 pb-4" style={{ color: "var(--foreground)", borderBottom: "1px solid var(--border)", letterSpacing: "0.12em" }}>
                <Package className="w-4 h-4 inline mr-2" style={{ color: "var(--primary)" }} />
                Order Summary
              </h3>

              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: "54px", height: "64px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <Image src={item.product.images?.[0] || ""} alt={item.product.name} fill className="object-cover" sizes="54px" />
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-sm font-medium line-clamp-2" style={{ color: "var(--foreground)" }}>{item.product.name}</p>
                      <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 text-sm" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between" style={{ color: "var(--foreground-muted)" }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--foreground-muted)" }}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span style={{ color: "var(--success)" }}>Free</span> : `₹${shipping}`}</span>
                </div>
                <div
                  className="flex justify-between font-bold pt-2"
                  style={{ borderTop: "1px solid var(--border)", color: "var(--foreground)", fontSize: "1rem" }}
                >
                  <span>Total</span>
                  <span style={{ color: "var(--primary)" }}>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 mt-5 pt-4 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" style={{ color: "var(--primary)" }} /> Secure</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" style={{ color: "var(--primary)" }} /> Energized</span>
                <span className="flex items-center gap-1"><Truck className="w-3 h-3" style={{ color: "var(--primary)" }} /> COD OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
