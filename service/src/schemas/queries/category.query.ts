import { prisma } from "@configs/mysql-db.config.js";

export const categoryQuery = `#graphql
  extend type Query {
    categories: [Category!]!
    category(id: String!): Category
    categoriesByCompany(companyId: String!): [Category!]!
  }
`;

export const categoryQueryResolvers = {
    Query: {
        categories: async () => await prisma.category.findMany({ where: { deleted_at: null } }),
        category: async (_parent: unknown, args: { id: string }) =>
            await prisma.category.findUnique({ where: { id: args.id, deleted_at: null } }),
        categoriesByCompany: async (_parent: unknown, args: { companyId: string }) =>
            await prisma.category.findMany({ where: { company_id: args.companyId, deleted_at: null } }),
    },
};