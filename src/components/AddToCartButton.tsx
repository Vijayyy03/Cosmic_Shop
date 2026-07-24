"use client";

import { useState } from "react";
import { Product } from "@/lib/excel";
import { useCartStore } from "@/store/cart";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center border border-border rounded-full p-1 bg-background">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <button
        onClick={handleAdd}
        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-full font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}
