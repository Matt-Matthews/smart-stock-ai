import { prisma } from "@configs/mysql-db.config.js";

export const permissionQuery = `#graphql
    extend type Query {
        permissions: [Permission!]!
        permission(id: String!): Permission
    }
`;

export const permissionQueryResolvers = {
    Query: {
        permissions: async () => await prisma.permission.findMany({ where: { deleted_at: null } }),
        permission: async (_parent: unknown, args: { id: string }) =>
            await prisma.permission.findUnique({ where: { id: args.id, deleted_at: null } }),
    },
};
