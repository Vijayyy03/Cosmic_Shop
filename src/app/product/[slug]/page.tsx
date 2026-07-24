import { Metadata } from "next";
import { getProductBySlug, getProducts, getProductsByCategory } from "@/lib/excel";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.extendedContent?.seoTitle || product.name,
    description: product.extendedContent?.seoMetaDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.extendedContent?.seoTitle || product.name,
      description: product.extendedContent?.seoMetaDescription || product.description.slice(0, 160),
      images: product.images.length > 0 ? [{ url: product.images[0], width: 800, height: 800 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.extendedContent?.seoTitle || product.name,
      description: product.extendedContent?.seoMetaDescription || product.description.slice(0, 160),
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const categoryProducts = await getProductsByCategory(product.category);
  const related = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductDetailClient product={product} related={related} />

      {/* Related Products — rendered server-side so ProductCard (client) can use hooks */}
      {related.length > 0 && (
        <div
          style={{
            background: "var(--background)",
            paddingBottom: "5rem",
            marginTop: "-2rem",
          }}
        >
          <div className="container">
            <div
              style={{ borderTop: "1px solid var(--border)", paddingTop: "4rem" }}
            >
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="section-tag">Discover More</p>
                  <h2
                    className="font-serif font-semibold text-2xl"
                    style={{ color: "var(--foreground)" }}
                  >
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href={`/shop?category=${product.category.toLowerCase()}`}
                  className="text-xs font-semibold transition-colors hidden sm:block"
                  style={{
                    color: "var(--primary)",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
