import { prisma } from "@configs/mysql-db.config.js";

export const inventoryMutation = `#graphql
  extend type Mutation {
    createInventoryEntry(company_id: String!, item_id: String!, quantity: Int!, status: String!, event_hash: String,): Inventory!
    updateInventoryEntry(id: String!, quantity: Int!, event_hash: String): Inventory!
    deleteInventoryEntry(id: String!): Inventory!
  }
`;

export const inventoryMutationResolvers = {
    Mutation: {
        createInventoryEntry: async (_parent: unknown, args: { company_id: string, item_id: string, quantity: number, event_hash: string, status: string }) => {
            const entry = await prisma.inventory.create({
                data: args,
                select: {
                    id: true,
                    company_id: true,
                    created_at: true,
                    deleted_at: true,
                    event_hash: true,
                    item_id: true,
                    quantity: true,
                    status: true,
                    updated_at: true,
                    item: {
                        include: {
                            category: true,
                            currency: true
                        }
                    }
                }
            });
            return entry;
        },
        updateInventoryEntry: async (_parent: unknown, args: { id: string, quantity: number, event_hash: string, status: string }) => {
            const entry = await prisma.inventory.update({
                where: { id: args.id },
                data: { quantity: args.quantity, event_hash: args.event_hash, status: args.status },
            });
            return entry;
        },
        deleteInventoryEntry: async (_parent: unknown, args: { id: string }) => {
            const entry = await prisma.inventory.update({
                where: { id: args.id },
                data: { deleted_at: new Date() },
            });
            return entry;
        },
    },
};