import Transaction from '@models/transaction.model.js';

export default async function seedTransactions(company: any, user: any, product: any) {
  const count = await Transaction.countDocuments();
  if (count > 0) {
    console.log('Transactions already seeded');
    return await Transaction.find({});
  }

  const transactions = [
    {
      company_id: company._id,
      user_id: user._id,
      product_id: product._id,
      quantity: 2,
      total_price: 30,
      transaction_type: 'sale'
    }
  ];

  const created = await Transaction.insertMany(transactions as any[]);
  console.log(`Seeded ${created.length} transactions`);
  return created;
}
