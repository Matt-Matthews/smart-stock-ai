import User from '@models/user.model.js';

export default async function seedUsers(company: any) {
  const count = await User.countDocuments();
  if (count > 0) {
    console.log('Users already seeded');
    return await User.find({});
  }

  const users = [
    {
      company_id: company._id,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@acme.example',
      role_id: 'admin',
      password: 'password123'
    }
  ];

  const created = await User.insertMany(users as any[]);
  console.log(`Seeded ${created.length} users`);
  return created;
}
