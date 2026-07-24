import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data.xlsx");

export type ProductCategory = "GEMSTONE" | "MALA" | "SOAP" | "POWDER";

export interface ProductVariant {
  name: string;
  options: { label: string; price: number; stock: number }[];
}

export interface ProductExtendedContent {
  whyChoose?: string[];
  keyBenefits?: string[];
  howToUse?: { title: string; desc: string }[];
  idealFor?: string[];
  routine?: string;
  faqs?: { question: string; answer: string }[];
  disclaimer?: string;
  qualityPromise?: string;
  seoTitle?: string;
  seoMetaDescription?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory | string;
  price: number;
  comparePrice?: number;
  images: string[];
  isEnergized: boolean;
  isBestseller: boolean;
  isNew: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  origin?: string;
  careInstructions?: string;
  attributes: Record<string, string | number | boolean>;
  variants: ProductVariant[];
  tags: string[];
  extendedContent?: ProductExtendedContent;
}

// ─── Workbook Helpers ────────────────────────────────────────────────────────

export async function getWorkbook(): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  if (fs.existsSync(DATA_FILE)) {
    await workbook.xlsx.readFile(DATA_FILE);
  } else {
    workbook.addWorksheet("Products");
    workbook.addWorksheet("Orders");
    workbook.addWorksheet("OrderItems");
    await saveWorkbook(workbook);
  }
  return workbook;
}

export async function saveWorkbook(workbook: ExcelJS.Workbook): Promise<void> {
  await workbook.xlsx.writeFile(DATA_FILE);
}

// ─── Product CRUD ────────────────────────────────────────────────────────────

function parseRow(row: ExcelJS.Row): Product | null {
  const getVal = (col: number): string => {
    const val = row.getCell(col).value;
    return val?.toString() || "";
  };
  const safeParse = <T>(val: string, fallback: T): T => {
    try {
      return val ? (JSON.parse(val) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const id = getVal(1);
  if (!id) return null;

  return {
    id,
    name: getVal(2),
    slug: getVal(3),
    description: getVal(4),
    category: getVal(5) as ProductCategory,
    price: parseFloat(getVal(6)) || 0,
    comparePrice: parseFloat(getVal(7)) || undefined,
    images: safeParse<string[]>(getVal(8), []),
    isEnergized: getVal(9) === "true",
    isBestseller: getVal(10) === "true",
    isNew: getVal(11) === "true",
    stock: parseInt(getVal(12)) || 0,
    rating: parseFloat(getVal(13)) || 0,
    reviewCount: parseInt(getVal(14)) || 0,
    badge: getVal(15) || undefined,
    origin: getVal(16) || undefined,
    careInstructions: getVal(17) || undefined,
    attributes: safeParse<Record<string, string | number | boolean>>(getVal(18), {}),
    variants: safeParse<ProductVariant[]>(getVal(19), []),
    tags: safeParse<string[]>(getVal(20), []),
    extendedContent: safeParse<ProductExtendedContent | undefined>(getVal(21), undefined),
  };
}

export async function getProducts(): Promise<Product[]> {
  const workbook = await getWorkbook();
  let sheet = workbook.getWorksheet("Products");

  if (!sheet) {
    sheet = workbook.addWorksheet("Products");
  }

  // Auto-seed if empty
  if (sheet.rowCount <= 1) {
    await seedProducts(workbook);
    await saveWorkbook(workbook);
    return getProducts();
  }

  const products: Product[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const product = parseRow(row);
    if (product) products.push(product);
  });

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.isBestseller || p.isNew).slice(0, limit);
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.isBestseller)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts();
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const workbook = await getWorkbook();
  const sheet = workbook.getWorksheet("Products");
  if (!sheet) return false;

  let rowToUpdate: ExcelJS.Row | null = null;
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    if (row.getCell(1).value?.toString() === id) {
      rowToUpdate = row;
    }
  });

  if (!rowToUpdate) return false;

  const row = rowToUpdate as ExcelJS.Row;
  if (updates.name !== undefined) row.getCell(2).value = updates.name;
  if (updates.slug !== undefined) row.getCell(3).value = updates.slug;
  if (updates.description !== undefined) row.getCell(4).value = updates.description;
  if (updates.category !== undefined) row.getCell(5).value = updates.category;
  if (updates.price !== undefined) row.getCell(6).value = updates.price;
  if (updates.comparePrice !== undefined) row.getCell(7).value = updates.comparePrice;
  if (updates.images !== undefined) row.getCell(8).value = JSON.stringify(updates.images);
  if (updates.isEnergized !== undefined) row.getCell(9).value = updates.isEnergized ? "true" : "false";
  if (updates.isBestseller !== undefined) row.getCell(10).value = updates.isBestseller ? "true" : "false";
  if (updates.isNew !== undefined) row.getCell(11).value = updates.isNew ? "true" : "false";
  if (updates.stock !== undefined) row.getCell(12).value = updates.stock;
  if (updates.rating !== undefined) row.getCell(13).value = updates.rating;
  if (updates.reviewCount !== undefined) row.getCell(14).value = updates.reviewCount;
  if (updates.badge !== undefined) row.getCell(15).value = updates.badge;
  if (updates.origin !== undefined) row.getCell(16).value = updates.origin;
  if (updates.careInstructions !== undefined) row.getCell(17).value = updates.careInstructions;
  if (updates.attributes !== undefined) row.getCell(18).value = JSON.stringify(updates.attributes);
  if (updates.variants !== undefined) row.getCell(19).value = JSON.stringify(updates.variants);
  if (updates.tags !== undefined) row.getCell(20).value = JSON.stringify(updates.tags);
  if (updates.extendedContent !== undefined) row.getCell(21).value = JSON.stringify(updates.extendedContent);

  await saveWorkbook(workbook);
  return true;
}

// ─── Orders CRUD ─────────────────────────────────────────────────────────────

export interface OrderData {
  id: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
}

export interface OrderItemData {
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export async function createOrder(order: OrderData, items: OrderItemData[]) {
  const workbook = await getWorkbook();
  
  // Ensure Sheets exist
  let orderSheet = workbook.getWorksheet("Orders");
  if (!orderSheet) {
    orderSheet = workbook.addWorksheet("Orders");
    orderSheet.addRow([
      "ID", "Date", "FirstName", "LastName", "Email", "Phone", 
      "Address", "City", "State", "Pincode", "Country", 
      "PaymentMethod", "Subtotal", "Shipping", "Total", "Status"
    ]);
  } else if (orderSheet.rowCount === 0) {
    orderSheet.addRow([
      "ID", "Date", "FirstName", "LastName", "Email", "Phone", 
      "Address", "City", "State", "Pincode", "Country", 
      "PaymentMethod", "Subtotal", "Shipping", "Total", "Status"
    ]);
  }

  let itemsSheet = workbook.getWorksheet("OrderItems");
  if (!itemsSheet) {
    itemsSheet = workbook.addWorksheet("OrderItems");
    itemsSheet.addRow(["OrderID", "ProductID", "ProductName", "Price", "Quantity"]);
  } else if (itemsSheet.rowCount === 0) {
    itemsSheet.addRow(["OrderID", "ProductID", "ProductName", "Price", "Quantity"]);
  }

  // Add Order
  orderSheet.addRow([
    order.id, order.date, order.firstName, order.lastName, order.email, order.phone,
    order.address, order.city, order.state, order.pincode, order.country,
    order.paymentMethod, order.subtotal, order.shipping, order.total, order.status
  ]);

  // Add Items
  items.forEach(item => {
    itemsSheet!.addRow([
      item.orderId, item.productId, item.productName, item.price, item.quantity
    ]);
  });

  await saveWorkbook(workbook);
  return order.id;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SAMPLE_PRODUCTS: Omit<Product, never>[] = [
  {
    id: "pow-005",
    name: "Shiv Cosmic Aura Powder",
    slug: "shiv-cosmic-aura-powder",
    description: "A blend of selected natural herbs and traditional ingredients to keep home, office, and business spaces calm, clean, and positive. Complements daily cleaning with an energy-purification ritual — safe for floor cleaning and bath use.",
    category: "POWDER",
    price: 700,
    comparePrice: undefined,
    images: [
      "/aura-powder.png",
    ],
    isEnergized: false,
    isBestseller: true,
    isNew: true,
    stock: 50,
    rating: 0,
    reviewCount: 0,
    badge: "Premium",
    origin: "India",
    careInstructions: "Store in a cool, dry place. Keep out of reach of children.",
    attributes: { 
      "Brand": "Shiv Cosmic Energy Solutions Pvt. Ltd.", 
      "Product Name": "Shiv Cosmic Aura Powder",
      "Product Type": "Aura Powder", 
      "Net Quantity": "TBD",
      "MRP": "₹700",
      "Country of Origin": "India",
      "Shelf Life": "TBD"
    },
    variants: [],
    tags: ["home care", "spiritual wellness", "aura cleansing", "floor cleaning", "bath use", "positive energy"],
    extendedContent: {
      keyBenefits: [
        "keeps home atmosphere calm and pleasant",
        "supports a sense of positivity",
        "complements daily cleansing with energy purification",
        "creates a favorable environment for pooja, meditation, and spiritual practice",
        "suitable for regular use in homes, offices, and commercial spaces",
        "helps maintain a lasting sense of freshness and cleanliness"
      ],
      howToUse: [
        { title: "Floor Cleaning", desc: "Mix ½ tablespoon Aura Powder in a bucket of water and mop the entire house." },
        { title: "Bath Use", desc: "Mix ½ tablespoon Aura Powder into bath water." }
      ],
      idealFor: ["homes", "flats", "bungalows", "offices", "shops", "clinics", "commercial spaces", "pooja rooms", "meditation rooms", "yoga studios"],
      faqs: [
        { question: "what it's used for / हे कशासाठी वापरले जाते?", answer: "For floor cleaning and in bath water. / घरातील फर्शी स्वच्छ करण्यासाठी तसेच स्नानाच्या पाण्यात वापरण्यासाठी." },
        { question: "how much to use per application / एका वेळेस किती प्रमाण वापरावे?", answer: "It is recommended to use ½ tablespoon of Aura Powder for floor cleaning or bathing. / फर्शी स्वच्छ करण्यासाठी किंवा स्नानासाठी ½ टेबलस्पून Aura Powder वापरण्याची शिफारस केली जाते." },
        { question: "can it be used in both home and office / घर आणि ऑफिस दोन्हीकडे वापरता येतो का?", answer: "Yes. It can be used in homes, offices, shops and other commercial spaces. / होय. घर, कार्यालय, दुकान तसेच इतर व्यावसायिक जागांमध्ये वापरता येतो." },
        { question: "can it be used daily / दररोज वापरता येईल का?", answer: "Yes. It can be used regularly as needed. / होय. आवश्यकतेनुसार नियमित वापर करता येतो." }
      ],
      disclaimer: "Traditional/spiritual use product, not a substitute for medical treatment; results may vary by individual.",
      seoTitle: "Shiv Cosmic Aura Powder | Premium Aura Powder for Home & Spiritual Wellness",
      seoMetaDescription: "Shiv Cosmic Aura Powder is crafted with selected natural herbs and traditional ingredients to support a pleasant and positive home environment. Suitable for floor cleaning and bath use. Perfect for homes, offices, shops and spiritual spaces."
    }
  },
  {
    id: "gem-006",
    name: "Cosmic Energy Crystal Pyramid",
    slug: "cosmic-energy-crystal-pyramid",
    description: "A beautiful crystal pyramid designed to harness cosmic energy and channel it into your space. Perfect for meditation and energy healing.",
    category: "GEMSTONE",
    price: 1299,
    images: ["https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=800&h=900&fit=crop"],
    isEnergized: true,
    isBestseller: false,
    isNew: true,
    stock: 0,
    rating: 0,
    reviewCount: 0,
    attributes: {},
    variants: [],
    tags: ["crystal", "pyramid", "energy", "healing"],
  },
  {
    id: "lamp-001",
    name: "Himalayan Healing Salt Lamp",
    slug: "himalayan-healing-salt-lamp",
    description: "Authentic Himalayan salt lamp that purifies the air and creates a soothing, warm glow in any room.",
    category: "LIFESTYLE",
    price: 1599,
    images: ["https://images.unsplash.com/photo-1617634734056-4d0d2f5c4e20?w=800&h=900&fit=crop"],
    isEnergized: false,
    isBestseller: false,
    isNew: true,
    stock: 0,
    rating: 0,
    reviewCount: 0,
    attributes: {},
    variants: [],
    tags: ["salt lamp", "himalayan", "healing", "lifestyle"],
  }
];

async function seedProducts(workbook: ExcelJS.Workbook): Promise<void> {
  let sheet = workbook.getWorksheet("Products");
  if (!sheet) sheet = workbook.addWorksheet("Products");

  // Write header row
  const headers = [
    "ID", "Name", "Slug", "Description", "Category", "Price", "ComparePrice",
    "Images", "IsEnergized", "IsBestseller", "IsNew", "Stock", "Rating", "ReviewCount",
    "Badge", "Origin", "CareInstructions", "Attributes", "Variants", "Tags", "ExtendedContent"
  ];

  const headerRow = sheet.getRow(1);
  headers.forEach((h, i) => {
    headerRow.getCell(i + 1).value = h;
  });
  headerRow.commit();

  // Write product rows
  SAMPLE_PRODUCTS.forEach((product, idx) => {
    const row = sheet!.getRow(idx + 2);
    row.getCell(1).value = product.id;
    row.getCell(2).value = product.name;
    row.getCell(3).value = product.slug;
    row.getCell(4).value = product.description;
    row.getCell(5).value = product.category;
    row.getCell(6).value = product.price;
    row.getCell(7).value = product.comparePrice ?? null;
    row.getCell(8).value = JSON.stringify(product.images);
    row.getCell(9).value = product.isEnergized ? "true" : "false";
    row.getCell(10).value = product.isBestseller ? "true" : "false";
    row.getCell(11).value = product.isNew ? "true" : "false";
    row.getCell(12).value = product.stock;
    row.getCell(13).value = product.rating;
    row.getCell(14).value = product.reviewCount;
    row.getCell(15).value = product.badge ?? "";
    row.getCell(16).value = product.origin ?? "";
    row.getCell(17).value = product.careInstructions ?? "";
    row.getCell(18).value = JSON.stringify(product.attributes);
    row.getCell(19).value = JSON.stringify(product.variants);
    row.getCell(20).value = JSON.stringify(product.tags);
    row.getCell(21).value = product.extendedContent ? JSON.stringify(product.extendedContent) : "";
    row.commit();
  });
}

// ─── Admin CRUD ─────────────────────────────────────────────────────────────

export async function addProduct(product: Product) {
  const workbook = await getWorkbook();
  let sheet = workbook.getWorksheet("Products");
  if (!sheet) {
    sheet = workbook.addWorksheet("Products");
  }
  
  sheet.addRow([
    product.id,
    product.name,
    product.slug,
    product.description,
    product.category,
    product.price,
    product.comparePrice ?? null,
    JSON.stringify(product.images),
    product.isEnergized ? "true" : "false",
    product.isBestseller ? "true" : "false",
    product.isNew ? "true" : "false",
    product.stock,
    product.rating,
    product.reviewCount,
    product.badge ?? "",
    product.origin ?? "",
    product.careInstructions ?? "",
    JSON.stringify(product.attributes),
    JSON.stringify(product.variants),
    JSON.stringify(product.tags),
    product.extendedContent ? JSON.stringify(product.extendedContent) : ""
  ]);

  await saveWorkbook(workbook);
  return true;
}

export async function deleteProduct(id: string) {
  const workbook = await getWorkbook();
  const sheet = workbook.getWorksheet("Products");
  if (!sheet) return false;

  let rowToDelete: number | null = null;
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    if (row.getCell(1).value === id) {
      rowToDelete = rowNumber;
    }
  });

  if (rowToDelete) {
    sheet.spliceRows(rowToDelete, 1);
    await saveWorkbook(workbook);
    return true;
  }
  return false;
}

export async function getOrders(): Promise<OrderData[]> {
  const workbook = await getWorkbook();
  const sheet = workbook.getWorksheet("Orders");
  if (!sheet) return [];

  const orders: OrderData[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    orders.push({
      id: row.getCell(1).value?.toString() || "",
      date: row.getCell(2).value?.toString() || "",
      firstName: row.getCell(3).value?.toString() || "",
      lastName: row.getCell(4).value?.toString() || "",
      email: row.getCell(5).value?.toString() || "",
      phone: row.getCell(6).value?.toString() || "",
      address: row.getCell(7).value?.toString() || "",
      city: row.getCell(8).value?.toString() || "",
      state: row.getCell(9).value?.toString() || "",
      pincode: row.getCell(10).value?.toString() || "",
      country: row.getCell(11).value?.toString() || "",
      paymentMethod: row.getCell(12).value?.toString() || "",
      subtotal: Number(row.getCell(13).value) || 0,
      shipping: Number(row.getCell(14).value) || 0,
      total: Number(row.getCell(15).value) || 0,
      status: row.getCell(16).value?.toString() || "",
    });
  });
  return orders;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const workbook = await getWorkbook();
  const sheet = workbook.getWorksheet("Orders");
  if (!sheet) return false;

  let updated = false;
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    if (row.getCell(1).value?.toString() === orderId) {
      row.getCell(16).value = status;
      updated = true;
    }
  });

  if (updated) {
    await saveWorkbook(workbook);
    return true;
  }
  return false;
}
