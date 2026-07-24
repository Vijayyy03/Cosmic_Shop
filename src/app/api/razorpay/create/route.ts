import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getProducts } from "@/lib/excel";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const isAllowed = rateLimit(ip, "razorpay_create", 10, 5 * 60 * 1000); // 10 checkouts per 5 mins

    if (!isAllowed) {
      return NextResponse.json({ error: "Too many checkout requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    const allProducts = await getProducts();
    let subtotal = 0;

    for (const item of items) {
      const product = allProducts.find(p => p.id === item.product.id);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.product.id}` }, { status: 400 });
      }
      subtotal += product.price * item.quantity;
    }

    const shipping = subtotal >= 999 ? 0 : 79;
    const amount = subtotal + shipping;

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
    };

    const order = await instance.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
