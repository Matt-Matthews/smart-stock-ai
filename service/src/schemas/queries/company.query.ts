import { prisma } from "@configs/mysql-db.config.js";

export const companyQuery = `#graphql
  extend type Query {
    companies: [Company!]!
    company(id: String!): Company
  }
`;

export const companyQueryResolvers = {
    Query: {
        companies: async () => await prisma.company.findMany({ where: { deleted_at: null } }),
        company: async (_parent: unknown, args: { id: string }) =>
            await prisma.company.findUnique({ where: { id: args.id, deleted_at: null } }),
    },
};