import Permission from "@models/permission.model.js";
import RolePermission from "@models/role-permission.model.js";
import Role from "@models/role.model.js";

export const rolePermissionQuery = `#graphql
    extend type Query {
        rolePermissions: [RolePermission!]!
        rolePermission(_id: String!): RolePermissionData
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
        rolePermissions: async () => await RolePermission.find({ deleted_at: null }).lean(),
        rolePermission: async (_parent: unknown, args: { _id: string }) =>{
            const rolePermission = await RolePermission.findOne({ _id: args._id, deleted_at: null }).lean();
            const role = await Role.findOne({ _id: rolePermission?.role_id, deleted_at: null }).lean();
            const permission = await Permission.findOne({ _id: rolePermission?.permission_id, deleted_at: null }).lean();
            return {
                ...rolePermission,
                role,
                permission
            };
        },
        permissionsByRole: async (_parent: unknown, args: { role_id: string }) =>
            await RolePermission.find({ role_id: args.role_id, deleted_at: null }).lean(),
        rolesByPermission: async (_parent: unknown, args: { permission_id: string }) =>
            await RolePermission.find({ permission_id: args.permission_id, deleted_at: null }).lean()
    }
};