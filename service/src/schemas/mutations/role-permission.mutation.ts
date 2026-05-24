import RolePermission from "@models/role-permission.model.js";

export const rolePermissionMutation = `#graphql
    extend type Mutation {
        assignPermissionToRole(role_id: String!, permission_id: String!): RolePermission!
        removePermissionFromRole(role_id: String!, permission_id: String!): RolePermission
    }
`;

export const rolePermissionMutationResolvers = {
    Mutation: {
        assignPermissionToRole: async (_parent: unknown, args: { role_id: string; permission_id: string }) => {
            const existing = await RolePermission.findOne({ role_id: args.role_id, permission_id: args.permission_id });
            if (existing) {
                throw new Error('Permission is already assigned to this role');
            }
            const rolePermission = new RolePermission({
                role_id: args.role_id,
                permission_id: args.permission_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
                enabled: true
            });
            return await rolePermission.save();
        },
        removePermissionFromRole: async (_parent: unknown, args: { role_id: string; permission_id: string }) => {
            const rolePermission = await RolePermission.findOne({ role_id: args.role_id, permission_id: args.permission_id });
            if (!rolePermission) {
                throw new Error('Permission is not assigned to this role');
            }
            rolePermission.deleted_at = new Date();
            rolePermission.enabled = false;
            return await rolePermission.save();
        }
    }
};