import { prisma } from "@configs/mysql-db.config.js";

export const userQuery = `#graphql
  extend type Query {
    users: [User!]!
    user(id: String!): User
    usersByCompany(company_id: String!): [User!]!
  }
`;

export const userQueryResolvers = {
    Query: {
        users: async () => await prisma.user.findMany({ where: { deleted_at: null }, include: { role: true } }),
        user: async (_parent: unknown, args: { id: string }) =>
          await prisma.user.findFirst({ where: { id: args.id, deleted_at: null }, include: { role: true } }),
        usersByCompany: async (_parent: unknown, args: { company_id: string }) =>
          await prisma.user.findMany({ where: { company_id: args.company_id, deleted_at: null }, include: { role: true } }),
    },
};