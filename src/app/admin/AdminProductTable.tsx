"use client";

import { useState } from "react";
import { Product } from "@/lib/excel";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";

export default function AdminProductTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ price: product.price, name: product.name });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success("Product updated successfully!");
        setProducts(products.map(p => 
          p.id === id ? { ...p, ...editForm } : p
        ));
        setEditingId(null);
      } else {
        toast.error("Failed to update product.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs">
          <tr>
            <th className="px-6 py-4 font-medium">ID</th>
            <th className="px-6 py-4 font-medium">Product Name</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Price</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => {
            const isEditing = editingId === product.id;

            return (
              <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-muted-foreground">{product.id}</td>
                
                <td className="px-6 py-4 font-medium text-foreground">
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="px-3 py-1 border border-border rounded-md bg-background w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                
                <td className="px-6 py-4 text-muted-foreground">
                  {product.category}
                </td>
                
                <td className="px-6 py-4">
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-muted-foreground">$</span>
                      <input 
                        type="number"
                        value={editForm.price || ""}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                        className="px-3 py-1 border border-border rounded-md bg-background w-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                
                <td className="px-6 py-4 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleSave(product.id)}
                        disabled={isSaving}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors disabled:opacity-50"
                        title="Save"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
