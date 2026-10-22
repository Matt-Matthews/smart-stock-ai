import { itemQuery, itemQueryResolvers } from './queries/item.query.js';
import { itemMutation, itemMutationResolvers } from './mutations/item.mutation.js';
import { inventoryMutation, inventoryMutationResolvers } from './mutations/inventory.mutation.js';
import { inventoryQuery, inventoryQueryResolvers } from './queries/inventory.query.js';
import { transactionQuery, transactionQueryResolvers } from "./queries/transaction.query.js";
import { transactionMutation, transactionMutationResolvers } from "./mutations/transaction.mutation.js";
import { userQuery, userQueryResolvers } from "./queries/user.query.js";
import { userMutation, userMutationResolvers } from "./mutations/user.mutation.js";
import { companyQuery, companyQueryResolvers } from "./queries/company.query.js";
import { companyMutation, companyMutationResolvers } from "./mutations/company.mutation.js";
import { roleQuery, roleQueryResolvers } from "./queries/role.query.js";
import { roleMutation, roleMutationResolvers } from "./mutations/role.mutation.js";
import { permissionQuery, permissionQueryResolvers } from "./queries/permission.query.js";
import { permissionMutation, permissionMutationResolvers } from "./mutations/permission.mutation.js";
import { rolePermissionQuery, rolePermissionQueryResolvers } from "./queries/role-permission.query.js";
import { rolePermissionMutation, rolePermissionMutationResolvers } from "./mutations/role-permission.mutation.js";
import {categoryQuery, categoryQueryResolvers } from "./queries/category.query.js";
import {currencyQuery, currencyQueryResolvers } from "./queries/currency.query.js";
import { categoryMutation, categoryMutationResolvers } from "./mutations/category.mutation.js";
import { currencyMutation, currencyMutationResolvers } from "./mutations/currency.mutation.js";
import { supplierQuery, supplierQueryResolvers } from './queries/supplier.query.js';
import { supplierMutation, supplierMutationResolvers } from './mutations/supplier.mutation.js';
import { invoiceQuery, invoiceQueryResolvers } from './queries/invoice.query.js';
import { invoiceMutation, invoiceMutationResolvers } from './mutations/invoice.mutation.js';
import { invoiceItemQuery, invoiceItemQueryResolvers } from './queries/invoice-item.query.js';
import { invoiceItemMutation, invoiceItemMutationResolvers } from './mutations/invoice-item.mutation.js';
import { reportQuery, reportQueryResolvers } from './queries/report.query.js';
import { reportMutation, reportMutationResolvers } from './mutations/report.mutation.js';
import { notificationQuery, notificationQueryResolvers } from './queries/notification.query.js';
import { notificationMutation, notificationMutationResolvers } from './mutations/notification.mutation.js';
import { dashboardQuery, dashboardQueryResolvers } from './queries/dashboard.query.js';
import { profileMutation, profileMutationResolvers } from './mutations/profile.mutation.js';

export const typeDefs = [`#graphql
  type Currency {
    id: String!
    code: String!
    name: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Category {
    id: String!
    company_id: String!
    name: String!
    description: String
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Item {
    id: String!
    company_id: String!
    name: String!
    description: String!
    cost_price: Float!
    sell_price: Float!
    sku: String
    barcode: String
    currency_id: String!
    category_id: String!
    currency: Currency
    category: Category
    inventory: Inventory
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Inventory {
    id: String!
    company_id: String!
    item_id: String!
    quantity: Int!
    status: String!
    created_at: String
    updated_at: String
    deleted_at: String
    item: Item
    transactions: [Transaction!]!
    event_hash: String
  }

  type Transaction {
    id: String!
    company_id: String!
    inventory_id: String!
    quantity: Int!
    type: String!
    created_at: String
    updated_at: String
    deleted_at: String
    inventory: Inventory
  }

  type User {
    id: String!
    company_id: String!
    first_name: String!
    last_name: String!
    email: String!
    role_id: String!
    created_at: String
    updated_at: String
    deleted_at: String
    enabled: Boolean!
    role: Role
  }

  type Company {
    id: String!
    name: String!
    address: String!
    phone: String!
    email: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Role {
    id: String!
    name: String!
    description: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Permission {
    id: String!
    name: String!
    description: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type RolePermission {
    id: String!
    role_id: String!
    permission_id: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Supplier {
    id: String!
    name: String!
    description: String
    company_id: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Invoice {
    id: String!
    supplier_id: String!
    company_id: String!
    amount: Float!
    vat: Float!
    total: Float!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type InvoiceItem {
    id: String!
    invoice_id: String!
    item_id: String!
    quantity: Int!
    price: Float!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Report {
    id: String!
    name: String!
    description: String
    company_id: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Notification {
    id: String!
    user_id: String!
    company_id: String!
    title: String!
    message: String!
    type: String!
    read_at: String
    created_at: String
    updated_at: String
  }

  type Query {
    health: String
  }

  type Mutation {
    _empty: String
  }
`, itemQuery,
  itemMutation,
  inventoryQuery,
  inventoryMutation,
  transactionQuery,
  transactionMutation,
  userQuery,
  userMutation,
  companyQuery,
  companyMutation,
  roleQuery,
  roleMutation,
  permissionQuery,
  permissionMutation,
  rolePermissionQuery,
  rolePermissionMutation,
  categoryQuery,
  categoryMutation,
  currencyQuery,
  currencyMutation,
  supplierQuery,
  supplierMutation,
  invoiceQuery,
  invoiceMutation,
  invoiceItemQuery,
  invoiceItemMutation,
  reportQuery,
  reportMutation,
  notificationQuery,
  notificationMutation,
  dashboardQuery,
  profileMutation
];

export const resolvers: Record<string, any> = [
  {
    Query: {
      health: () => 'GraphQL API is healthy',
    },
  },
  itemQueryResolvers,
  itemMutationResolvers,
  inventoryQueryResolvers,
  inventoryMutationResolvers,
  transactionQueryResolvers,
  transactionMutationResolvers,
  userQueryResolvers,
  userMutationResolvers,
  companyQueryResolvers,
  companyMutationResolvers,
  roleQueryResolvers,
  roleMutationResolvers,
  permissionQueryResolvers,
  permissionMutationResolvers,
  rolePermissionQueryResolvers,
  rolePermissionMutationResolvers,
  categoryQueryResolvers,
  categoryMutationResolvers,
  currencyQueryResolvers,
  currencyMutationResolvers,
  supplierQueryResolvers,
  supplierMutationResolvers,
  invoiceQueryResolvers,
  invoiceMutationResolvers,
  invoiceItemQueryResolvers,
  invoiceItemMutationResolvers,
  reportQueryResolvers,
  reportMutationResolvers,
  notificationQueryResolvers,
  notificationMutationResolvers,
  dashboardQueryResolvers,
  profileMutationResolvers
];
