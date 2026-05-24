import Product from '@models/product.model.js';

export const productQuery = `#graphql
  extend type Query {
    products: [Product!]!
    product(_id: String!): Product
  }
`;

export const productQueryResolvers = {
  Query: {
    products: async () => await Product.find({ deleted_at: null }).lean(),
    product: async (_parent: unknown, args: { _id: string }) =>
      await Product.findOne({ _id: args._id, deleted_at: null }).lean(),
  },
};
