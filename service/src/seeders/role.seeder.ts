import Role from '@models/role.model.js';

export default async function seedRoles() {
  const count = await Role.countDocuments();
  if (count > 0) {
    console.log('Roles already seeded');
    return await Role.find({});
  }

  const roles = [
    { name: 'admin', description: 'Administrator' },
    { name: 'user', description: 'Regular user' }
  ];

  const created = await Role.insertMany(roles as any[]);
  console.log(`Seeded ${created.length} roles`);
  return created;
}
