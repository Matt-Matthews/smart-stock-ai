import { prisma } from "@configs/mysql-db.config.js";

export const rolePermissionMutation = `#graphql
    extend type Mutation {
        assignPermissionToRole(role_id: String!, permission_id: String!): RolePermission!
        removePermissionFromRole(role_id: String!, permission_id: String!): RolePermission
    }
`;

export const rolePermissionMutationResolvers = {
    Mutation: {
        assignPermissionToRole: async (_parent: unknown, args: { role_id: string; permission_id: string }) => {
            const existing = await prisma.rolePermission.findFirst({
                where: {
                    role_id: args.role_id,
                    permission_id: args.permission_id,
                    deleted_at: null
                }
            });
            if (existing) {
                throw new Error('Permission is already assigned to this role');
            }
            const rolePermission = await prisma.rolePermission.create({
                data: {
                    role_id: args.role_id,
                    permission_id: args.permission_id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null,
                    enabled: true
                }
            });

            return rolePermission;
        },
        removePermissionFromRole: async (_parent: unknown, args: { role_id: string; permission_id: string }) => {

            const updatedRolePermission = await prisma.rolePermission.updateMany({
                where: {
                    role_id: args.role_id,
                    permission_id: args.permission_id,
                    deleted_at: null
                },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                }
            });
            return updatedRolePermission;
        }
    }
};