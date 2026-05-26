import Company from "@models/company.model.js";
import Inventory from "@models/inventory.model.js";
import inventory from "@models/inventory.model.js";
import Transaction from "@models/transaction.model.js";

export const transactionQuery = `#graphql
  extend type Query {
    transactions: [Transaction!]!
    transaction(_id: String!): TransactionWithInventoryDetails
    transactionsByCompany(company_id: String!): [Transaction!]!
    transactionsByInventory(inventory_id: String!): [Transaction!]!
    transactionsWithInventoryDetails: [TransactionWithInventoryDetails!]!
  }

    type TransactionWithInventoryDetails {
    _id: String!
    company_id: String!
    inventory_id: String!
    quantity: Int!
    created_at: String
    updated_at: String
    deleted_at: String
    inventory: Inventory
    company: Company
    }
`;

export const transactionQueryResolvers = {
    Query: {
        transactions: async () => await Transaction.find({ deleted_at: null }).lean(),
        transaction: async (_parent: unknown, args: { _id: string }) => {
            const transaction = await Transaction.findOne({ _id: args._id, deleted_at: null }).lean();
            if (!transaction) return null;
            const inventory = await Inventory.findOne({ _id: transaction.inventory_id, deleted_at: null }).lean();
            const company = await Company.findOne({ _id: transaction.company_id, deleted_at: null }).lean();
            return {
                ...transaction,
                inventory,
                company
            };
        },
        transactionsByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await Transaction.find({ company_id: args.company_id, deleted_at: null }).lean(),
        transactionsByInventory: async (_parent: unknown, args: { inventory_id: string }) =>
            await Transaction.find({ inventory_id: args.inventory_id, deleted_at: null }).lean(),
        transactionsWithInventoryDetails: async (_parent: unknown, args: { company_id?: string }) => {
            const transactions = await Transaction.find({ deleted_at: null, ...(args.company_id && { company_id: args.company_id }) }).lean();
            const inventoryIds = transactions.map(transaction => transaction.inventory_id);
            const inventories = await Inventory.find({ _id: { $in: inventoryIds }, deleted_at: null }).lean();
            const inventoryMap = new Map(inventories.map(inventory => [inventory._id.toString(), inventory]));
            const company = args.company_id ? await Company.findOne({ _id: args.company_id, deleted_at: null }).lean() : null;
            return transactions.map(transaction => ({
                ...transaction,
                inventory: inventoryMap.get(transaction.inventory_id.toString()) || null,
                company
            }));
        }
    },
};