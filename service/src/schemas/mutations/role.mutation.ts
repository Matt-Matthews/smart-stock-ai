import Role from "@models/role.model.js";

export const roleMutation = `#graphql
  extend type Mutation {
    createRole(company_id: String, description: String!): Role!
    updateRole(_id: String!, company_id: String, description: String): Role!
    deleteRole(_id: String!): Role!
  }
`;

export const roleMutationResolvers = {
    Mutation: {
        createRole: async (_parent: unknown, args: { company_id?: string, description: string }) => {
            const role = await Role.create(args);
            return role;
        },
        updateRole: async (_parent: unknown, args: { _id: string, company_id?: string, description?: string }) => {
            const role = await Role.findOneAndUpdate( { _id: args._id, deleted_at: null }, args, { new: true }).lean();
            return role;
        },
        deleteRole: async (_parent: unknown, args: { _id: string }) => {
            const role = await Role.findOneAndUpdate( { _id: args._id, deleted_at: null }, { deleted_at: new Date() }, { new: true }).lean();
            return role;
        }
    },
};