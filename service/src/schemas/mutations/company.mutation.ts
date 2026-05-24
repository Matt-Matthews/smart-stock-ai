import Company from "@models/company.model.js";

export const companyMutation = `#graphql
  extend type Mutation {
    createCompany(name: String!, address: String!, phone: String!, email: String!): Company!
    updateCompany(_id: String!, name: String, address: String, phone: String, email: String): Company!
    deleteCompany(_id: String!): Company!
  }
`;

export const companyMutationResolvers = {
    Mutation: {
        createCompany: async (_parent: unknown, args: { name: string, address: string, phone: string, email: string }) => {
            const company = await Company.create(args);
            return company;
        },
        updateCompany: async (_parent: unknown, args: { _id: string, name?: string, address?: string, phone?: string, email?: string }) => {
            const company = await Company.findOneAndUpdate( { _id: args._id, deleted_at: null }, args, { new: true }).lean();
            return company;
        },
        deleteCompany: async (_parent: unknown, args: { _id: string }) => {
            const company = await Company.findOneAndUpdate( { _id: args._id, deleted_at: null }, { deleted_at: new Date() }, { new: true }).lean();
            return company;
        },
    },
};