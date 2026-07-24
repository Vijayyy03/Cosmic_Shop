"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Truck, PackageCheck, Clock } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        toast.success(`Order marked as ${status}`);
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading orders...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Payment</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-900">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{order.id}</div>
                      <div className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.firstName} {order.lastName}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                      <div className="text-xs text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{order.total.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                        order.paymentMethod === 'cod' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.paymentMethod === 'cod' ? 'COD' : 'PREPAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'Pending')}`}>
                        {!order.status || order.status === 'Pending' ? <Clock className="w-3 h-3" /> : null}
                        {order.status === 'Shipped' ? <Truck className="w-3 h-3" /> : null}
                        {order.status === 'Delivered' ? <PackageCheck className="w-3 h-3" /> : null}
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {(!order.status || order.status === 'Pending') && (
                          <button 
                            disabled={updatingId === order.id}
                            onClick={() => updateStatus(order.id, "Shipped")} 
                            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button 
                            disabled={updatingId === order.id}
                            onClick={() => updateStatus(order.id, "Delivered")} 
                            className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <span className="text-xs text-gray-400 font-medium px-3 py-1.5 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
