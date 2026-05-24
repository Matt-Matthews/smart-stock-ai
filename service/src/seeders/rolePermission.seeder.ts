import RolePermission from '@models/role-permission.model.js';

export default async function seedRolePermissions(roleMap: any, permissionMap: any) {
  const count = await RolePermission.countDocuments();
  if (count > 0) {
    console.log('RolePermissions already seeded');
    return [];
  }

  const entries = [
    {
      role_id: roleMap['admin']?._id || null,
      permission_id: permissionMap['manage_products']?._id || null
    }
  ].filter(e => e.role_id && e.permission_id);

  const created = await RolePermission.insertMany(entries as any[]);
  console.log(`Seeded ${created.length} role-permissions`);
  return created;
}
