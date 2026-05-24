import User from '@models/user.model.js';

export const userMutation = `#graphql
  extend type Mutation {
    createUser(name: String!, email: String!, password: String!, role_id: String!): User!
    updateUser(_id: String!, name: String, email: String, password: String, role_id: String): User!
    deleteUser(_id: String!): User!
  }
`;

export const userMutationResolvers = {
    Mutation: {
        createUser: async (_parent: unknown, args: { name: string, email: string, password: string, role_id: string }) => {
            const user = await User.create(args);
            return user;
        },
        updateUser: async (_parent: unknown, args: { _id: string, name?: string, email?: string, password?: string, role_id?: string }) => {
            const user = await User.findOneAndUpdate( { _id: args._id, deleted_at: null }, args, { new: true }).lean();
            return user;
        },
        deleteUser: async (_parent: unknown, args: { _id: string }) => {
            const user = await User.findOneAndUpdate( { _id: args._id, deleted_at: null }, { deleted_at: new Date() }, { new: true }).lean();
            return user;
        },
    },
};