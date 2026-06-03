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
    description: String!
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
    sku: String!
    barcode: String!
    currency_id: String!
    category_id: String!
    currency: Currency
    category: Category
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
    event_hash: String
  }

  type Transaction {
    id: String!
    company_id: String!
    inventory_id: String!
    quantity: Int!
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
  currencyMutation
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
  currencyMutationResolvers
];
