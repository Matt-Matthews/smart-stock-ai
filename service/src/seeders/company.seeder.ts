import Company from '@models/company.model.js';

export default async function seedCompanies() {
  const count = await Company.countDocuments();
  if (count > 0) {
    console.log('Companies already seeded');
    return await Company.find({});
  }

  const companies = [
    {
      name: 'Acme Corp',
      address: '123 Main St',
      phone: '+10000000000',
      email: 'hello@acme.example'
    }
  ];

  const created = await Company.insertMany(companies as any[]);
  console.log(`Seeded ${created.length} companies`);
  return created;
}
