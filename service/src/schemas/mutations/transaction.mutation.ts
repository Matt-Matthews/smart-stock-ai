import { prisma } from "@configs/mysql-db.config.js";

export const transactionMutation = `#graphql
  extend type Mutation {
    createTransaction(company_id: String!, inventory_id: String!, quantity: Int!): Transaction!
    updateTransaction(id: String!, quantity: Int!): Transaction!
    deleteTransaction(id: String!): Transaction!
  }
`;

export const transactionMutationResolvers = {
    Mutation: {
        createTransaction: async (_parent: unknown, args: { company_id: string, inventory_id: string, quantity: number, type: string }) => {
            const transaction = await prisma.transaction.create({
                data: args
            });
            return transaction;
        },
        updateTransaction: async (_parent: unknown, args: { id: string, quantity: number }) => {
            const transaction = await prisma.transaction.update({
                where: { id: args.id, deleted_at: null },
                data: { quantity: args.quantity }
            });
            return transaction;
        },
        deleteTransaction: async (_parent: unknown, args: { id: string }) => {
            const transaction = await prisma.transaction.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                }
            });
            return transaction;
        },
    },
};