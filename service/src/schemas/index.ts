import { productQuery, productQueryResolvers } from './queries/product.query.js';
import { productMutation, productMutationResolvers } from './mutations/product.mutation.js';

export const typeDefs = [`#graphql
  type Product {
    _id: String!
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
    created_at: String
    updated_at: String
    deleted_at: String
  }

  type Query {
    hello: String
  }

  type Mutation {
    _empty: String
  }
`, productQuery, productMutation];

export const resolvers = [
  {
    Query: {
      hello: () => 'Hello world!',
    },
  },
  productQueryResolvers,
  productMutationResolvers,
];
