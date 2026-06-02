import { prisma } from "@configs/mysql-db.config.js";

export const roleQuery = `#graphql
    extend type Query {
        roles: [Role!]!
        role(_id: String!): Role
        rolesByCompany(company_id: String!): [Role!]!
        roleWithoutCompany: [Role!]!
    }
`;

export const roleQueryResolvers = {
    Query: {
        roles: async () => await prisma.role.findMany({ where: { deleted_at: null } }),
        role: async (_parent: unknown, args: { _id: string }) =>
            await prisma.role.findUnique({ where: { id: args._id, deleted_at: null } }),
        rolesByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await prisma.role.findMany({ where: { company_id: args.company_id, deleted_at: null } }),
        roleWithoutCompany: async () =>
            await prisma.role.findMany({ where: { deleted_at: null } }),
    },
};