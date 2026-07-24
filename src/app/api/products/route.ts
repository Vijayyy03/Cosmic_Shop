import { NextResponse } from "next/server";
import { getProducts, getProductsByCategory } from "@/lib/excel";
import { ProductCategory } from "@/lib/excel";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    let products = [];

    if (category && category.toLowerCase() !== "all") {
      products = await getProductsByCategory(category.toUpperCase() as ProductCategory);
    } else {
      products = await getProducts();
    }

    if (q) {
      const lowerQ = q.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQ) ||
          p.description.toLowerCase().includes(lowerQ) ||
          p.tags?.some((t) => t.toLowerCase().includes(lowerQ))
      );
    }

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("API Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
