import { NextResponse } from "next/server";
import { getOrders } from "@/lib/excel";

export async function GET() {
  try {
    const orders = await getOrders();
    // Sort orders by most recent first
    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
