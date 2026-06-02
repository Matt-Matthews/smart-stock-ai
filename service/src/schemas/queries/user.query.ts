import { prisma } from "@configs/mysql-db.config.js";

export const userQuery = `#graphql
  extend type Query {
    users: [User!]!
    user(_id: String!): User
    usersByCompany(company_id: String!): [User!]!
  }
`;

export const userQueryResolvers = {
    Query: {
        users: async () => await prisma.user.findMany({ where: { deleted_at: null } }),
        user: async (_parent: unknown, args: { _id: string }) =>
            await prisma.user.findUnique({ where: { id: args._id, deleted_at: null } }),
        usersByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await prisma.user.findMany({ where: { company_id: args.company_id, deleted_at: null } }),
    },
};