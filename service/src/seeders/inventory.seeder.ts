import Inventory from '@models/inventory.model.js';

export default async function seedInventory(company: any, product: any) {
  const count = await Inventory.countDocuments();
  if (count > 0) {
    console.log('Inventory already seeded');
    return await Inventory.find({});
  }

  const entries = [
    {
      company_id: company._id,
      product_id: product._id,
      quantity: 100
    }
  ];

  const created = await Inventory.insertMany(entries as any[]);
  console.log(`Seeded ${created.length} inventory entries`);
  return created;
}
