import Product from '@models/product.model.js';

export const productQuery = `#graphql
  extend type Query {
    products: [Product!]!
    product(_id: String!): Product
    productsByCompany(companyId: String!): [Product!]!
  }
`;

export const productQueryResolvers = {
  Query: {
    products: async () => await Product.find({ deleted_at: null }).lean(),
    product: async (_parent: unknown, args: { id: string }) =>
      await Product.findOne({ _id: args.id, deleted_at: null }).lean(),
    productsByCompany: async (_parent: unknown, args: { companyId: string }) =>
      await Product.find({ company_id: args.companyId, deleted_at: null }).lean(),
  },
};
