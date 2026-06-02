import { prisma } from "@configs/mysql-db.config.js";

export const itemQuery = `#graphql
  extend type Query {
    items: [Item!]!
    item(id: String!): Item
    itemsByCompany(companyId: String!): [Item!]!
  }
`;

export const itemQueryResolvers = {
  Query: {
    items: async () => await prisma.item.findMany({ where: { deleted_at: null }, include: { currency: true, category: true } }),
    item: async (_parent: unknown, args: { id: string }) =>
      await prisma.item.findUnique({ where: { id: args.id, deleted_at: null }, include: { currency: true, category: true } }),
    itemsByCompany: async (_parent: unknown, args: { companyId: string }) =>
      await prisma.item.findMany({ where: { company_id: args.companyId, deleted_at: null }, include: { currency: true, category: true } }),
  },
};
