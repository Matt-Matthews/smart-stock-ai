import { prisma } from "@configs/mysql-db.config.js";

export const currencyQuery = `#graphql
  extend type Query {
    currencies: [Currency!]!
    currency(id: String!): Currency
  }
`;

export const currencyQueryResolvers = {
    Query: {
        currencies: async () => await prisma.currency.findMany({ where: { deleted_at: null } }),
        currency: async (_parent: unknown, args: { id: string }) =>
            await prisma.currency.findUnique({ where: { id: args.id, deleted_at: null } }),
    },
};