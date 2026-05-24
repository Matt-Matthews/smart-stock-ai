import User from "@models/user.model.js";

export const userQuery = `#graphql
  extend type Query {
    users: [User!]!
    user(_id: String!): User
    usersByCompany(company_id: String!): [User!]!
  }
`;

export const userQueryResolvers = {
    Query: {
        users: async () => await User.find({ deleted_at: null }).lean(),
        user: async (_parent: unknown, args: { _id: string }) =>
            await User.findOne({ _id: args._id, deleted_at: null }).lean(),
        usersByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await User.find({ company_id: args.company_id, deleted_at: null }).lean(),
    },
};