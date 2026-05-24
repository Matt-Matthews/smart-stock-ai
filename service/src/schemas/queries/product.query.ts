import Product from '@models/product.model.js';

export const productQuery = `#graphql
  extend type Query {
    products: [Product!]!
    product(id: String!): Product
  }
`;

export const productQueryResolvers = {
  Query: {
    products: async () => await Product.find({ deleted_at: null }).lean(),
    product: async (_parent: unknown, args: { id: string }) =>
      await Product.findOne({ id: args.id, deleted_at: null }).lean(),
  },
};
