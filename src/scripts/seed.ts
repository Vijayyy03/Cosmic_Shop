import { getWorkbook, saveWorkbook } from '../lib/excel';

const sampleProducts = [
  {
    id: '1',
    name: 'Rose Quartz Gemstone',
    slug: 'rose-quartz-gemstone',
    description: 'A beautiful raw rose quartz for opening the heart chakra.',
    category: 'GEMSTONE',
    price: 25.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1596489370041-37d457630713?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'true',
    attributes: JSON.stringify({ material: 'Quartz', size: 'Medium' }),
    variants: JSON.stringify([])
  },
  {
    id: '2',
    name: 'Sandalwood Mala',
    slug: 'sandalwood-mala',
    description: 'Traditional 108 bead sandalwood mala for meditation.',
    category: 'MALA',
    price: 45.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1627914392472-3580041c2c31?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'true',
    attributes: JSON.stringify({ material: 'Sandalwood', length: '32 inches' }),
    variants: JSON.stringify([])
  },
  {
    id: '3',
    name: 'Lavender Artisan Soap',
    slug: 'lavender-artisan-soap',
    description: 'Handmade cold-process soap infused with essential lavender oil.',
    category: 'SOAP',
    price: 12.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'false',
    attributes: JSON.stringify({ scent: 'Lavender', weight: '4 oz' }),
    variants: JSON.stringify([])
  },
  {
    id: '4',
    name: 'Ashwagandha Root Powder',
    slug: 'ashwagandha-root-powder',
    description: 'Organic adaptogenic powder for stress relief.',
    category: 'POWDER',
    price: 30.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1616111162464-b0d3bb630722?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'false',
    attributes: JSON.stringify({ origin: 'India', weight: '200g' }),
    variants: JSON.stringify([])
  },
  {
    id: '5',
    name: 'Amethyst Crystal Cluster',
    slug: 'amethyst-crystal-cluster',
    description: 'Deep purple amethyst cluster for intuition and peace.',
    category: 'GEMSTONE',
    price: 65.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1596489370041-37d457630713?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'true',
    attributes: JSON.stringify({ material: 'Amethyst', weight: '1.2 lbs' }),
    variants: JSON.stringify([])
  },
  {
    id: '6',
    name: 'Clear Quartz Point',
    slug: 'clear-quartz-point',
    description: 'High-vibration clear quartz point for amplifying energy.',
    category: 'GEMSTONE',
    price: 18.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1596489370041-37d457630713?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'true',
    attributes: JSON.stringify({ material: 'Clear Quartz', size: 'Small' }),
    variants: JSON.stringify([])
  },
  {
    id: '7',
    name: 'Rudraksha Seed Mala',
    slug: 'rudraksha-seed-mala',
    description: 'Authentic 5-Mukhi Rudraksha mala for spiritual protection.',
    category: 'MALA',
    price: 55.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1627914392472-3580041c2c31?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'true',
    attributes: JSON.stringify({ material: 'Rudraksha', beads: 108 }),
    variants: JSON.stringify([])
  },
  {
    id: '8',
    name: 'Sage & Cedar Smudge Soap',
    slug: 'sage-cedar-smudge-soap',
    description: 'Purifying soap crafted with wild-harvested white sage.',
    category: 'SOAP',
    price: 14.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'false',
    attributes: JSON.stringify({ scent: 'Sage & Cedar', weight: '4.5 oz' }),
    variants: JSON.stringify([])
  },
  {
    id: '9',
    name: 'Moringa Leaf Powder',
    slug: 'moringa-leaf-powder',
    description: 'Nutrient-dense superfood powder for daily vitality.',
    category: 'POWDER',
    price: 24.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1616111162464-b0d3bb630722?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'false',
    attributes: JSON.stringify({ origin: 'Sri Lanka', weight: '250g' }),
    variants: JSON.stringify([])
  },
  {
    id: '10',
    name: 'Turmeric & Honey Glow Soap',
    slug: 'turmeric-honey-glow-soap',
    description: 'Brightening organic soap for a natural, radiant glow.',
    category: 'SOAP',
    price: 15.0,
    images: JSON.stringify(['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=600&auto=format&fit=crop']),
    isEnergized: 'false',
    attributes: JSON.stringify({ scent: 'Turmeric', weight: '4 oz' }),
    variants: JSON.stringify([])
  }
];

async function seed() {
  const workbook = await getWorkbook();
  const sheet = workbook.getWorksheet('Products');
  
  if (!sheet) {
    console.error("Products sheet not found!");
    return;
  }

  // Clear existing data
  sheet.spliceRows(1, sheet.rowCount);

  // Add header
  sheet.addRow([
    'id', 'name', 'slug', 'description', 'category', 'price', 
    'images', 'isEnergized', 'attributes', 'variants'
  ]);

  // Add products
  sampleProducts.forEach(p => {
    sheet.addRow([
      p.id, p.name, p.slug, p.description, p.category, p.price,
      p.images, p.isEnergized, p.attributes, p.variants
    ]);
  });

  await saveWorkbook(workbook);
  console.log('Database (data.xlsx) seeded successfully!');
}

seed().catch(console.error);
