import { prisma } from "@configs/mysql-db.config.js";

export const transactionMutation = `#graphql
  extend type Mutation {
    createTransaction(company_id: String!, inventory_id: String!, quantity: Int!): Transaction!
    recordPurchase(company_id: String!, items: [PurchaseItemInput!]!): [Transaction!]!
    updateTransaction(id: String!, quantity: Int!): Transaction!
    deleteTransaction(id: String!): Transaction!
  }

  input PurchaseItemInput {
    item_id: String!
    quantity: Int!
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
        recordPurchase: async (
            _parent: unknown,
            args: { company_id: string, items: Array<{ item_id: string, quantity: number }> },
            context: { user: { company_id: string } }
        ) => {
            if (args.company_id !== context.user.company_id) {
                throw new Error("Purchases can only be recorded for your company.");
            }
            if (args.items.length === 0) {
                throw new Error("A purchase must contain at least one item.");
            }

            const quantitiesByItem = new Map<string, number>();
            for (const item of args.items) {
                if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
                    throw new Error("Purchase quantities must be positive whole numbers.");
                }
                quantitiesByItem.set(
                    item.item_id,
                    (quantitiesByItem.get(item.item_id) ?? 0) + item.quantity
                );
            }

            return prisma.$transaction(async (transaction) => {
                const recordedTransactions = [];
                for (const [itemId, quantity] of quantitiesByItem) {
                    const item = await transaction.item.findFirst({
                        where: {
                            id: itemId,
                            company_id: args.company_id,
                            deleted_at: null
                        },
                        select: { id: true }
                    });
                    if (!item) {
                        throw new Error("A purchase item does not belong to this company.");
                    }

                    const inventory = await transaction.inventory.upsert({
                        where: { item_id: itemId },
                        update: {
                            quantity: { increment: quantity },
                            status: "in_stock",
                            deleted_at: null
                        },
                        create: {
                            item_id: itemId,
                            company_id: args.company_id,
                            quantity,
                            status: "in_stock"
                        }
                    });
                    recordedTransactions.push(
                        await transaction.transaction.create({
                            data: {
                                company_id: args.company_id,
                                inventory_id: inventory.id,
                                quantity,
                                type: "purchase"
                            }
                        })
                    );
                }
                return recordedTransactions;
            });
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