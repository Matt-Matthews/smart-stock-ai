import { prisma } from "@configs/mysql-db.config.js";
import type { Currency } from '@configs/generated/prisma/index.js';

export const currencyMutation = `#graphql
  extend type Mutation {
    createCurrency(input: CreateCurrencyInput!): Currency!
    updateCurrency(id: String!, input: UpdateCurrencyInput!): Currency!
    deleteCurrency(id: String!): Currency!
  }

  input CreateCurrencyInput {
    code: String!
    name: String!
  }

  input UpdateCurrencyInput {
    code: String
    name: String
  }
`;

export const currencyMutationResolvers = {
    Mutation: {
        createCurrency: async (_parent: unknown, args: { input: Omit<Currency, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> }) => {
            const currency = await prisma.currency.create({
                data: args.input,
            });
            return currency;
        },
        updateCurrency: async (_parent: unknown, args: { id: string, input: Record<string, any> }) => {
            const currency = await prisma.currency.update({
                where: { id: args.id, deleted_at: null },
                data: args.input
            });
            return currency;
        },
        deleteCurrency: async (_parent: unknown, args: { id: string }) => {
            const currency = await prisma.currency.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                }
            });
            return currency;
        },
    },
};