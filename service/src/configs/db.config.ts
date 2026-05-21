import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import "@models/audit_log.model.js";
import "@models/product.model.js";
import "@models/user.model.js";
import "@models/role.model.js";
import "@models/permission.model.js";
import "@models/transaction.model.js";
import "@models/company.model.js";
import "@models/inventory.model.js";
import "@models/request_log.model.js";
import "@models/role-permission.model.js";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory';

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      // options tuned for Mongoose 7+
      autoIndex: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}