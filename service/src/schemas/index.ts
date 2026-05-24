import { productQuery, productQueryResolvers } from './queries/product.query.js';
import { productMutation, productMutationResolvers } from './mutations/product.mutation.js';
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

export const typeDefs = [`#graphql
  type Product {
    _id: String!
    company_id: String!
    name: String!
    description: String!
    cost_price: Float!
    selling_price: Float!
    sku: String!
    barcode: String!
    size: String!
    unit_of_measure: String!
    reorder_level: Int!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Inventory {
    _id: String!
    company_id: String!
    product_id: String!
    quantity: Int!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Transaction {
    _id: String!
    company_id: String!
    product_id: String!
    quantity: Int!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type User {
    _id: String!
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
    _id: String!
    name: String!
    address: String!
    phone: String!
    email: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Role {
    _id: String!
    name: String!
    description: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Permission {
    _id: String!
    name: String!
    description: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type RolePermission {
    _id: String!
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
`, productQuery,
  productMutation,
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
  rolePermissionMutation
];

export const resolvers = [
  {
    Query: {
      health: () => 'GraphQL API is healthy',
    },
  },
  productQueryResolvers,
  productMutationResolvers,
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
  rolePermissionMutationResolvers
];
