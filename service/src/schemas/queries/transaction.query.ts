import { prisma } from "@configs/mysql-db.config.js";

export const transactionQuery = `#graphql
  extend type Query {
    transactions: [Transaction!]!
    transaction(id: String!): TransactionWithInventoryDetails
    transactionsByCompany(company_id: String!): [Transaction!]!
    transactionsByInventory(inventory_id: String!): [Transaction!]!
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
        transactions: async () => await prisma.transaction.findMany(
            {
                where: { deleted_at: null },
                include: {
                    inventory: {
                        include: {
                            item: {
                                include: {
                                    category: true,
                                    currency: true
                                }
                            }
                        }
                    },
                }
            }),
        transaction: async (_parent: unknown, args: { id: string }) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id: args.id, deleted_at: null },
                include: {
                    inventory: {
                        include: {
                            item: {
                                include: {
                                    category: true,
                                    currency: true
                                }
                            }
                        }
                    },
                }
            });
            return transaction;
        },
        transactionsByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await prisma.transaction.findMany({ where: { company_id: args.company_id, deleted_at: null } }),
        transactionsByInventory: async (_parent: unknown, args: { inventory_id: string }) =>
            await prisma.transaction.findMany({ where: { inventory_id: args.inventory_id, deleted_at: null } }),
    },
};