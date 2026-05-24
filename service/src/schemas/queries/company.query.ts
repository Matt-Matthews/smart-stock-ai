import Company from "@models/company.model.js";

export const companyQuery = `#graphql
  extend type Query {
    companies: [Company!]!
    company(_id: String!): Company
  }
`;

export const companyQueryResolvers = {
    Query: {
        companies: async () => await Company.find({ deleted_at: null }).lean(),
        company: async (_parent: unknown, args: { _id: string }) =>
            await Company.findOne({ _id: args._id, deleted_at: null }).lean(),
    },
};