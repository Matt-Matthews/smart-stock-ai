import { prisma } from "@configs/mysql-db.config.js";

export const permissionMutation = `#graphql
    extend type Mutation {
        createPermission(name: String!, description: String!): Permission!
        updatePermission(id: String!, name: String, description: String): Permission
        deletePermission(id: String!): Permission
    }
`;

export const permissionMutationResolvers = {
    Mutation: {
        createPermission: async (_parent: unknown, args: { name: string; description: string }) => {
            const existing = await prisma.permission.findUnique({
                where: { name: args.name, deletedAt: null }
            });
            if (existing) {
                throw new Error('Permission with this name already exists');
            }
            const permission = await prisma.permission.create({
                data: {
                    name: args.name,
                    description: args.description,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                    enabled: true
                }
            });
            return permission;
        },
        updatePermission: async (_parent: unknown, args: { id: string; name?: string; description?: string }) => {
            const permission = await prisma.permission.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    ...(args.name ? { name: args.name } : {}),
                    ...(args.description ? { description: args.description } : {}),
                    updatedAt: new Date()
                }
            });

            return permission;
        },
        deletePermission: async (_parent: unknown, args: { id: string }) => {
            const permission = await prisma.permission.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                }
            });
            return permission;
        }
    }
};