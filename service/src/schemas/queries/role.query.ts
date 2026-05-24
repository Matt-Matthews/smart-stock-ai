import Role from "@models/role.model.js";

export const roleQuery = `#graphql
    extend type Query {
        roles: [Role!]!
        role(_id: String!): Role
        rolesByCompany(company_id: String!): [Role!]!
        roleWithoutCompany: [Role!]!
    }
`;

export const roleQueryResolvers = {
    Query: {
        roles: async () => await Role.find({ deleted_at: null }).lean(),
        role: async (_parent: unknown, args: { _id: string }) =>
            await Role.findOne({ _id: args._id, deleted_at: null }).lean(),
        rolesByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await Role.find({ company_id: args.company_id, deleted_at: null }).lean(),
        roleWithoutCompany: async () =>
            await Role.find({ company_id: null, deleted_at: null }).lean(),
    },
};