import nodemailer from 'nodemailer';
import { OrderData, OrderItemData } from './excel';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendOrderConfirmationEmails(order: OrderData, items: OrderItemData[]) {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.error("Missing SMTP credentials in .env");
    return;
  }

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
    </tr>
  `).join('');

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 2px solid #c9a84c;">
        <h2 style="color: #c9a84c; margin: 0; font-size: 24px;">Order & Payment Receipt</h2>
        <p style="margin: 5px 0 0; color: #666;">Shiv Cosmic Shop</p>
      </div>
      <div style="padding: 20px;">
        <p>Dear <strong>${order.firstName}</strong>,</p>
        <p>Thank you for shopping with us! Here is the receipt for your recent order.</p>
        
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 4px 0;"><strong>Order ID:</strong></td>
            <td style="padding: 4px 0; text-align: right;">${order.id}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Order Date:</strong></td>
            <td style="padding: 4px 0; text-align: right;">${new Date(order.date).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Payment Status:</strong></td>
            <td style="padding: 4px 0; text-align: right; color: ${order.paymentMethod === 'cod' ? '#f59e0b' : '#10b981'}; font-weight: bold;">
              ${order.paymentMethod === 'cod' ? 'Pending (Cash on Delivery)' : 'Paid'}
            </td>
          </tr>
        </table>
        
        <h3 style="border-bottom: 1px solid #eaeaea; padding-bottom: 8px; margin-top: 20px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #eaeaea;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid #eaeaea;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #eaeaea;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; border-top: 2px solid #eaeaea;">Subtotal:</td>
              <td style="padding: 10px; text-align: right; border-top: 2px solid #eaeaea;">₹${order.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;">Shipping:</td>
              <td style="padding: 10px; text-align: right;">₹${order.shipping.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #c9a84c;">₹${order.total.toLocaleString("en-IN")}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <p style="margin: 0 0 5px;"><strong>Shipping Address:</strong></p>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            ${order.address}<br/>
            ${order.city}, ${order.state} - ${order.pincode}<br/>
            ${order.country}
          </p>
        </div>
        
        <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
          With blessings,<br/><strong style="color: #333;">Shiv Cosmic Energy Solutions Pvt. Ltd.</strong>
        </p>
      </div>
    </div>
  `;

  try {
    // Send to Customer
    await transporter.sendMail({
      from: `"Shiv Cosmic Shop" <info.shivcosmic@gmail.com>`,
      to: order.email,
      subject: `Order Receipt - ${order.id}`,
      html: customerHtml,
    });

    // Send alert to Admin
    await transporter.sendMail({
      from: `"Shiv Cosmic Shop System" <info.shivcosmic@gmail.com>`,
      to: ADMIN_EMAIL,
      subject: `New Order Received - ${order.id}`,
      html: `<p>A new order was placed by ${order.firstName} ${order.lastName}.</p>${customerHtml}`,
    });

    console.log(`Order emails sent successfully for order ${order.id}`);
  } catch (error) {
    console.error("Error sending order emails:", error);
  }
}
