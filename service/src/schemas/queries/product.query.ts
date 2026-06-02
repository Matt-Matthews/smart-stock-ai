import { prisma } from "@configs/mysql-db.config.js";

export const productQuery = `#graphql
  extend type Query {
    products: [Product!]!
    product(id: String!): Product
    productsByCompany(companyId: String!): [Product!]!
  }
`;

export const productQueryResolvers = {
  Query: {
    products: async () => await prisma.item.findMany({ where: { deleted_at: null } }),
    product: async (_parent: unknown, args: { id: string }) =>
      await prisma.item.findUnique({ where: { id: args.id, deleted_at: null } }),
    productsByCompany: async (_parent: unknown, args: { companyId: string }) =>
      await prisma.item.findMany({ where: { company_id: args.companyId, deleted_at: null } }),
  },
};
