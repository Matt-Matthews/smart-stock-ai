import AuditLog from '@models/audit_log.model.js';

export default async function seedAuditLogs(user: any) {
  const count = await AuditLog.countDocuments();
  if (count > 0) {
    console.log('AuditLogs already seeded');
    return await AuditLog.find({});
  }

  const logs = [
    {
      user_id: user._id,
      action: 'seed:initial',
      details: 'Initial seeding of database'
    }
  ];

  const created = await AuditLog.insertMany(logs as any[]);
  console.log(`Seeded ${created.length} audit logs`);
  return created;
}
