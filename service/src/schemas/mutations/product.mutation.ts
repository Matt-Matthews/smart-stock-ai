import Product from '@models/product.model.js';

export const productMutation = `#graphql
  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
  }

  input CreateProductInput {
    company_id: String!
    name: String!
    description: String!
    cost_price: Float!
    selling_price: Float!
    sku: String!
    barcode: String!
    size: String!
    unit_of_measure: String!
    reorder_level: Int!
  }
`;

export const productMutationResolvers = {
  Mutation: {
    createProduct: async (_parent: unknown, args: { input: Record<string, any> }) => {
      const product = await Product.create(args.input);
      return product;
    },
  },
};
