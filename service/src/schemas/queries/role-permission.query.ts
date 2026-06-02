import { prisma } from "@configs/mysql-db.config.js";

export const rolePermissionQuery = `#graphql
    extend type Query {
        rolePermissions: [RolePermission!]!
        rolePermission(id: String!): RolePermissionData
        permissionsByRole(role_id: String!): [RolePermission!]!
        rolesByPermission(permission_id: String!): [RolePermission!]!
    }

    type RolePermissionData {
        _id: String!
        role_id: String!
        permission_id: String!
        created_at: String!
        updated_at: String!
        deleted_at: String
        role: Role
        permission: Permission
    }
`;

export const rolePermissionQueryResolvers = {
    Query: {
        rolePermissions: async () => await prisma.rolePermission.findMany({ where: { deleted_at: null } }),
        rolePermission: async (_parent: unknown, args: { id: string }) =>{
            const rolePermission = await prisma.rolePermission.findUnique({ 
                where: { id: args.id, deleted_at: null },
                include: {
                    permission: true,
                    role: true
                }
            });
            return rolePermission;
        },
        permissionsByRole: async (_parent: unknown, args: { role_id: string }) =>
            await prisma.rolePermission.findMany({ where: { role_id: args.role_id, deleted_at: null } }),
        rolesByPermission: async (_parent: unknown, args: { permission_id: string }) =>
            await prisma.rolePermission.findMany({ where: { permission_id: args.permission_id, deleted_at: null } })
    }
};