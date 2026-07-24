import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { OrderData, OrderItemData } from './excel';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function appendOrderToGoogleSheet(order: OrderData, items: OrderItemData[]) {
  if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.error("Missing Google Sheets credentials in .env");
    return;
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); // loads document properties and worksheets
    
    // Orders Sheet
    let ordersSheet = doc.sheetsByTitle['Orders'];
    if (!ordersSheet) {
      ordersSheet = await doc.addSheet({ headerValues: [
        "ID", "Date", "FirstName", "LastName", "Email", "Phone", 
        "Address", "City", "State", "Pincode", "Country", 
        "PaymentMethod", "Subtotal", "Shipping", "Total", "Status"
      ], title: 'Orders' });
    } else {
      // If the sheet already existed, ensure it has the right headers (optional, but safe)
      await ordersSheet.setHeaderRow([
        "ID", "Date", "FirstName", "LastName", "Email", "Phone", 
        "Address", "City", "State", "Pincode", "Country", 
        "PaymentMethod", "Subtotal", "Shipping", "Total", "Status"
      ]);
    }
    
    // Format items as a simple string for the Orders sheet summary if they don't want a separate sheet,
    // but the user's previous excel structure had a separate OrderItems sheet. We'll do both.
    await ordersSheet.addRow({
      ID: order.id,
      Date: order.date,
      FirstName: order.firstName,
      LastName: order.lastName,
      Email: order.email,
      Phone: order.phone,
      Address: order.address,
      City: order.city,
      State: order.state,
      Pincode: order.pincode,
      Country: order.country,
      PaymentMethod: order.paymentMethod,
      Subtotal: order.subtotal,
      Shipping: order.shipping,
      Total: order.total,
      Status: order.status
    });

    // OrderItems Sheet
    let itemsSheet = doc.sheetsByTitle['OrderItems'];
    if (!itemsSheet) {
      itemsSheet = await doc.addSheet({ headerValues: ["OrderID", "ProductID", "ProductName", "Price", "Quantity"], title: 'OrderItems' });
    } else {
      await itemsSheet.setHeaderRow(["OrderID", "ProductID", "ProductName", "Price", "Quantity"]);
    }

    const rowsToAdd = items.map(item => ({
      OrderID: item.orderId,
      ProductID: item.productId,
      ProductName: item.productName,
      Price: item.price,
      Quantity: item.quantity
    }));

    await itemsSheet.addRows(rowsToAdd);
    
    console.log(`Successfully appended order ${order.id} to Google Sheets`);
  } catch (error) {
    console.error("Error appending to Google Sheets:", error);
    // We don't throw to prevent breaking the checkout if only Sheets fails
  }
}
