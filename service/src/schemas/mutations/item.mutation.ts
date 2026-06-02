import { prisma } from "@configs/mysql-db.config.js";

interface CreateItemInput {
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

export const itemMutation = `#graphql
  extend type Mutation {
    createItem(input: CreateItemInput!): Item!
    updateItem(id: String!, input: UpdateItemInput!): Item!
    deleteItem(id: String!): Item!
  }

  input CreateItemInput {
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

  input UpdateItemInput {
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

export const itemMutationResolvers = {
  Mutation: {
    createItem: async (_parent: unknown, args: CreateItemInput) => {
      const item = await prisma.item.create({
        data: args,
      });
      return item;
    },
    updateItem: async (_parent: unknown, args: { id: string, input: Record<string, any> }) => {
      const item = await prisma.item.update({
        where: { id: args.id, deleted_at: null },
        data: args.input
      });
      return item;
    },
    deleteItem: async (_parent: unknown, args: { id: string }) => {
      const item = await prisma.item.update({
        where: { id: args.id, deleted_at: null },
        data: {
          deleted_at: new Date(),
          enabled: false
        }
      });
      return item;
    },
  },
};
