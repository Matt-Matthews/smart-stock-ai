import Permission from "@models/permission.model.js";

export const permissionQuery = `#graphql
    extend type Query {
        permissions: [Permission!]!
        permission(_id: String!): Permission
    }
`;

export const permissionQueryResolvers = {
    Query: {
        permissions: async () => await Permission.find({ deleted_at: null }).lean(),
        permission: async (_parent: unknown, args: { _id: string }) =>
            await Permission.findOne({ _id: args._id, deleted_at: null }).lean(),
    },
};
