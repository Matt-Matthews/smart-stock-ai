import Product from '@models/product.model.js';

export default async function seedProducts(company: any) {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log('Products already seeded');
    return await Product.find({});
  }

  const products = [
    {
      company_id: company._id,
      name: 'Sample Product',
      description: 'A sample product',
      cost_price: 10,
      selling_price: 15,
      sku: 'SKU-001',
      barcode: '0123456789012',
      size: 'M',
      unit_of_measure: 'pcs',
      reorder_level: 5
    }
  ];

  const created = await Product.insertMany(products as any[]);
  console.log(`Seeded ${created.length} products`);
  return created;
}
