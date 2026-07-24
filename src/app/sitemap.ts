import { MetadataRoute } from "next";
import { getProducts } from "@/lib/excel";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cosmicshop.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const date = new Date();

  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: date,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = [
    "gemstone",
    "mala",
    "powder",
    "soap"
  ].map((cat) => ({
    url: `${BASE_URL}/shop?category=${cat}`,
    lastModified: date,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const staticUrls = [
    "",
    "/shop",

    "/contact",
    "/faq",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: date,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
