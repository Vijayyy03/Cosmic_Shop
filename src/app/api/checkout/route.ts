import { NextRequest, NextResponse } from "next/server";
import { createOrder, OrderData, OrderItemData, getProducts } from "@/lib/excel";
import { appendOrderToGoogleSheet } from "@/lib/googleSheets";
import { sendOrderConfirmationEmails } from "@/lib/email";
import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const isAllowed = rateLimit(ip, "checkout", 10, 5 * 60 * 1000); // 10 checkouts per 5 mins

    if (!isAllowed) {
      return NextResponse.json({ error: "Too many checkout requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { contactInfo, shippingAddress, items, paymentMethod, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Basic validation
    if (!contactInfo || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid checkout data" },
        { status: 400 }
      );
    }

    if (paymentMethod === "online") {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: "Incomplete payment details" }, { status: 400 });
      }

      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Verify prices and calculate totals securely on backend
    const allProducts = await getProducts();
    let calculatedSubtotal = 0;
    const orderItems: OrderItemData[] = [];
    const orderId = "CS" + Date.now().toString().slice(-4) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    for (const item of items) {
      const product = allProducts.find(p => p.id === item.product.id);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.product.id}` }, { status: 400 });
      }
      calculatedSubtotal += product.price * item.quantity;
      
      orderItems.push({
        orderId,
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    const calculatedShipping = calculatedSubtotal >= 999 ? 0 : 79;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    const date = new Date().toISOString();

    const order: OrderData = {
      id: orderId,
      date,
      firstName: contactInfo.firstName,
      lastName: contactInfo.lastName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      country: shippingAddress.country,
      paymentMethod,
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
      status: paymentMethod === "cod" ? "Pending" : "Paid"
    };

    await createOrder(order, orderItems);
    
    // Run background tasks asynchronously to speed up checkout response
    Promise.all([
      appendOrderToGoogleSheet(order, orderItems),
      sendOrderConfirmationEmails(order, orderItems)
    ]).catch(err => {
      console.error("Error in post-checkout background tasks:", err);
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
