"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    images: [] as string[],
    isBestseller: false,
    isEnergized: false,
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("/api/admin/products");
        const products = await res.json();
        const product = products.find((p: any) => p.id === id);
        
        if (product) {
          setFormData({
            ...product,
            price: product.price.toString(),
            stock: product.stock.toString(),
          });
        } else {
          toast.error("Product not found");
          router.push("/admin/products");
        }
      } catch {
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      
      if (res.ok) {
        setFormData(prev => ({ ...prev, images: [...prev.images, result.url] }));
        toast.success("Image uploaded", { id: toastId });
      } else {
        toast.error(result.error || "Upload failed", { id: toastId });
      }
    } catch {
      toast.error("Upload failed", { id: toastId });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productPayload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      if (res.ok) {
        toast.success("Product updated successfully");
        router.push("/admin/products");
      } else {
        toast.error("Failed to update product");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">URL Slug</label>
            <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
            <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Stock</label>
            <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none"></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Product Images</label>
          <div className="flex flex-wrap gap-4 items-center mt-2">
            {formData.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                <Image src={img} alt="" fill className="object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
              </div>
            ))}
            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Upload</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isBestseller} onChange={e => setFormData({...formData, isBestseller: e.target.checked})} className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)]" />
            <span className="text-sm font-medium text-gray-700">Mark as Bestseller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isEnergized} onChange={e => setFormData({...formData, isEnergized: e.target.checked})} className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)]" />
            <span className="text-sm font-medium text-gray-700">Mark as Energized</span>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-70">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
