import Permission from "@models/permission.model.js";

export const permissionMutation = `#graphql
    extend type Mutation {
        createPermission(name: String!, description: String!): Permission!
        updatePermission(_id: String!, name: String, description: String): Permission
        deletePermission(_id: String!): Permission
    }
`;

export const permissionMutationResolvers = {
    Mutation: {
        createPermission: async (_parent: unknown, args: { name: string; description: string }) => {
            const existing = await Permission.findOne({ name: args.name, deleted_at: null });
            if (existing) {
                throw new Error('Permission with this name already exists');
            }
            const permission = new Permission({
                name: args.name,
                description: args.description,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
                enabled: true
            });
            return await permission.save();
        },
        updatePermission: async (_parent: unknown, args: { _id: string; name?: string; description?: string }) => {
            const permission = await Permission.findOne({ _id: args._id, deleted_at: null });
            if (!permission) {
                throw new Error('Permission not found');
            }
            if (args.name) {
                const existing = await Permission.findOne({ name: args.name, deleted_at: null, _id: { $ne: args._id } });
                if (existing) {
                    throw new Error('Permission with this name already exists');
                }
                permission.name = args.name;
            }
            if (args.description) {
                permission.description = args.description;
            }
            return await permission.save();
        },
        deletePermission: async (_parent: unknown, args: { _id: string }) => {
            const permission = await Permission.findOne({ _id: args._id, deleted_at: null });
            if (!permission) {
                throw new Error('Permission not found');
            }
            permission.deleted_at = new Date();
            permission.enabled = false;
            return await permission.save();
        }
    }
};