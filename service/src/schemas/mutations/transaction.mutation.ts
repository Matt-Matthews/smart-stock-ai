import Transaction from "@models/transaction.model.js";

export const transactionMutation = `#graphql
  extend type Mutation {
    createTransaction(company_id: String!, product_id: String!, quantity: Int!): Transaction!
    updateTransaction(_id: String!, quantity: Int!): Transaction!
    deleteTransaction(_id: String!): Transaction!
  }
`;

export const transactionMutationResolvers = {
    Mutation: {
        createTransaction: async (_parent: unknown, args: { company_id: string, product_id: string, quantity: number }) => {
            const transaction = await Transaction.create(args);
            return transaction;
        },
        updateTransaction: async (_parent: unknown, args: { _id: string, quantity: number }) => {
            const transaction = await Transaction.findOneAndUpdate( { _id: args._id, deleted_at: null }, { quantity: args.quantity }, { new: true }).lean();
            return transaction;
        },
        deleteTransaction: async (_parent: unknown, args: { _id: string }) => {
            const transaction = await Transaction.findOneAndUpdate( { _id: args._id, deleted_at: null }, { deleted_at: new Date() }, { new: true }).lean();
            return transaction;
        },
    },
};