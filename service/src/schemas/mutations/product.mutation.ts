import Product from '@models/product.model.js';

export const productMutation = `#graphql
  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(_id: String!, input: UpdateProductInput!): Product!
    deleteProduct(_id: String!): Product!
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

  input UpdateProductInput {
    company_id: String
    name: String
    description: String
    cost_price: Float
    selling_price: Float
    sku: String
    barcode: String
    size: String
    unit_of_measure: String
    reorder_level: Int
  }
`;

export const productMutationResolvers = {
  Mutation: {
    createProduct: async (_parent: unknown, args: { input: Record<string, any> }) => {
      const product = await Product.create(args.input);
      return product;
    },
    updateProduct: async (_parent: unknown, args: { _id: string, input: Record<string, any> }) => {
      const product = await Product.findOneAndUpdate( { _id: args._id, deleted_at: null }, args.input, { new: true }).lean();
      return product;
    },
    deleteProduct: async (_parent: unknown, args: { _id: string }) => {
      const product = await Product.findOneAndUpdate( { _id: args._id, deleted_at: null }, { deleted_at: new Date() }, { new: true }).lean();
      return product;
    },
  },
};
