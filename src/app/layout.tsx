import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Shiv Cosmic Shop | Premium E-Commerce Experience",
    template: "%s | Shiv Cosmic Shop",
  },
  description: "Your one-stop shop for everything you need. Discover our curated collection of premium products, delivered right to your door.",
  keywords: ["ecommerce", "store", "premium products", "online shopping", "lifestyle", "rudraksha", "crystals", "gemstones"],
  authors: [{ name: "Shiv Cosmic Shop" }],
  creator: "Shiv Cosmic Shop",
  publisher: "Shiv Cosmic Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://cosmicshop.in",
    siteName: "Shiv Cosmic Shop",
    title: "Shiv Cosmic Shop | Premium E-Commerce Experience",
    description: "Discover our curated collection of premium products.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=1200&h=630&fit=crop", // Adjust to your actual OG image
        width: 1200,
        height: 630,
        alt: "Shiv Cosmic Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiv Cosmic Shop | Premium E-Commerce Experience",
    description: "Discover our curated collection of premium products.",
    images: ["https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=1200&h=630&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col font-sans"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
