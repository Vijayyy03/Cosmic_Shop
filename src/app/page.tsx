import { Metadata } from "next";
import { getProducts } from "@/lib/excel";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Cosmic Shop — Sacred Gemstones, Vedic Malas & Wellness Products",
  description:
    "India's premium spiritual store — lab-certified gemstones, energized Rudraksha malas, sacred powders, and handmade Ayurvedic soaps. Delivered with tradition, certified with care.",
};

export const revalidate = 60;

export default async function Home() {
  const allProducts = await getProducts();

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh", padding: "4rem 0" }}>
      <div className="container mx-auto px-4">
        <h1 className="section-title mb-10 text-center text-4xl font-serif">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>
    </div>
  );
}
