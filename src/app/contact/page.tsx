"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Please write at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Our Office",
    value: "Pune, Maharashtra",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info.shivcosmic@gmail.com",
    href: "mailto:info.shivcosmic@gmail.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 7030127129",
    href: "tel:+917030127129",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Sat: 9am – 6pm IST\nSunday: 10am – 2pm",
  },
];

const SUBJECT_OPTIONS = [
  { value: "order", label: "Order Enquiry / Tracking" },
  { value: "product", label: "Product Question" },
  { value: "wholesale", label: "Wholesale / Bulk Order" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error('Failed to send message');
      
      setSubmitted(true);
      toast.success("Message sent! We'll respond within 24 hours.");
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast.error("Failed to send message. Please try again or reach out on WhatsApp.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-20 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">We're Here</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Have a question about your order, our products, or anything else? We're just a message away.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-6">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  {href ? (
                    <a href={href} className="text-sm text-gray-500 whitespace-pre-line hover:text-gray-900 transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 whitespace-pre-line">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              id="whatsapp"
              href="https://wa.me/917030127129?text=Hi%2C%20I%20have%20a%20query"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white p-6 rounded-xl shadow-sm flex items-start gap-4 transition-transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm uppercase tracking-wider mb-1">
                  Chat on WhatsApp
                </p>
                <p className="text-sm text-white/90">
                  Fastest response — typically under 1 hour
                </p>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-200 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="text-gray-500 mt-2">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input {...register("name")} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none" placeholder="John Doe" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input type="email" {...register("email")} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none" placeholder="you@example.com" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                      <input type="tel" {...register("phone")} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select {...register("subject")} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white">
                        <option value="">Select a topic...</option>
                        {SUBJECT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      {...register("message")}
                      rows={6}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
                      placeholder="Tell us how we can help..."
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white font-medium py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    We respond to all messages within 24 hours. For urgent issues, WhatsApp is fastest.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
