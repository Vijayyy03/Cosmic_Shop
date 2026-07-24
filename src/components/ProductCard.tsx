"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/excel";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCartStore();

  const primaryImage = product.images?.[0] || "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&h=800&fit=crop";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };



  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-gray-100">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
          

          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <span className="bg-white border border-gray-300 text-gray-500 px-3 py-1 text-sm font-medium rounded">
                Out of Stock / Coming Soon
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs line-through text-gray-500">
              ₹{product.comparePrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
