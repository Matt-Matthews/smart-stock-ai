import { prisma } from "@configs/mysql-db.config.js";

export const supplierQuery = `#graphql
  extend type Query {
    suppliers: [Supplier!]!
    supplier(id: String!): Supplier
    suppliersByCompany(company_id: String!): [Supplier!]!
  }
`;

export const supplierQueryResolvers = {
    Query: {
        suppliers: async () => await prisma.suppliers.findMany({ where: { deleted_at: null } }),
        supplier: async (_parent: unknown, args: { id: string }) =>
            await prisma.suppliers.findFirst({ where: { id: args.id, deleted_at: null } }),
        suppliersByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await prisma.suppliers.findMany({ where: { company_id: args.company_id, deleted_at: null } }),
    },
};