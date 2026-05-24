import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '@configs/db.config.js';
import seedCompanies from './company.seeder.js';
import seedRoles from './role.seeder.js';
import seedPermissions from './permission.seeder.js';
import seedRolePermissions from './rolePermission.seeder.js';
import seedUsers from './user.seeder.js';
import seedProducts from './product.seeder.js';
import seedInventory from './inventory.seeder.js';
import seedTransactions from './transaction.seeder.js';
import seedAuditLogs from './auditLog.seeder.js';
import seedRequestLogs from './requestLog.seeder.js';

async function run() {
  await connectDB();

  // Drop legacy id_1 unique indexes from old schema
  const collections = ['users', 'products', 'companies', 'roles', 'permissions', 'rolepermissions', 'transactions', 'inventories', 'auditlogs', 'requestlogs'];
  for (const collName of collections) {
    try {
      const coll = mongoose.connection.collection(collName);
      const indexes = await coll.indexes();
      const hasIdIndex = (indexes || []).some((idx: any) => idx.key && idx.key.id === 1);
      if (hasIdIndex) {
        await coll.dropIndex('id_1');
        console.log(`Dropped id_1 index on ${collName}`);
      }
    } catch (err) {
      // Index might not exist, ignore
    }
  }

  // Clear all collections before seeding
  for (const collName of collections) {
    try {
      const coll = mongoose.connection.collection(collName);
      await coll.deleteMany({});
    } catch (err) {
      // Collection might not exist, ignore
    }
  }
  console.log('Cleared all collections');

  const companies = await seedCompanies();
  const company = companies && companies[0];

  const roles = await seedRoles();
  const permissions = await seedPermissions();

  // Build quick maps for ids
  const roleMap: any = {};
  (roles || []).forEach((r: any) => (roleMap[r.name] = r));
  const permissionMap: any = {};
  (permissions || []).forEach((p: any) => (permissionMap[p.name] = p));

  await seedRolePermissions(roleMap, permissionMap);

  const users = await seedUsers(company);
  const user = users && users[0];

  const products = await seedProducts(company);
  const product = products && products[0];

  await seedInventory(company, product);
  await seedTransactions(company, user, product);
  await seedAuditLogs(user);
  await seedRequestLogs();

  await mongoose.disconnect();
  console.log('Seeding complete');
  process.exit(0);
}

run().catch(err => {
  console.error('Seeding failed', err);
  process.exit(1);
});
