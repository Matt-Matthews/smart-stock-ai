import Permission from '@models/permission.model.js';

export default async function seedPermissions() {
  const count = await Permission.countDocuments();
  if (count > 0) {
    console.log('Permissions already seeded');
    return await Permission.find({});
  }

  const permissions = [
    { name: 'manage_products', description: 'Manage products' },
    { name: 'manage_users', description: 'Manage users' }
  ];

  const created = await Permission.insertMany(permissions as any[]);
  console.log(`Seeded ${created.length} permissions`);
  return created;
}
