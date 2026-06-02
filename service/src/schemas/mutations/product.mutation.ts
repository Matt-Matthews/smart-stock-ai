import { prisma } from "@configs/mysql-db.config.js";

interface CreateProductInput {
  company_id: string
  name: string
  description: string
  cost_price: number
  sell_price: number
  sku: string
  barcode: string
  currency_id: string
  category_id: string
}

export const productMutation = `#graphql
  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: String!, input: UpdateProductInput!): Product!
    deleteProduct(id: String!): Product!
  }

  input CreateProductInput {
    company_id: String!
    name: String!
    description: String!
    cost_price: Float!
    sell_price: Float!
    sku: String!
    barcode: String!
    category_id: String!
    currency_id: String!
    # size: String!
    # unit_of_measure: String!
    # reorder_level: Int!
  }

  input UpdateProductInput {
    company_id: String
    name: String
    description: String
    cost_price: Float
    sell_price: Float
    sku: String
    barcode: String
    category_id: String
    currency_id: String
    # size: String
    # unit_of_measure: String
    # reorder_level: Int
  }
`;

export const productMutationResolvers = {
  Mutation: {
    createProduct: async (_parent: unknown, args: CreateProductInput) => {
      const product = await prisma.item.create({
        data: args,
      });
      return product;
    },
    updateProduct: async (_parent: unknown, args: { id: string, input: Record<string, any> }) => {
      const product = await prisma.item.update({
        where: { id: args.id, deleted_at: null },
        data: args.input
      });
      return product;
    },
    deleteProduct: async (_parent: unknown, args: { id: string }) => {
      const product = await prisma.item.update({
        where: { id: args.id, deleted_at: null },
        data: {
          deleted_at: new Date(),
          enabled: false
        }
      });
      return product;
    },
  },
};
