import Inventory from "@models/inventory.model.js";

export const inventoryMutation = `#graphql
  extend type Mutation {
    createInventoryEntry(company_id: String!, product_id: String!, quantity: Int!, event_hash: String): Inventory!
    updateInventoryEntry(_id: String!, quantity: Int!, event_hash: String): Inventory!
    deleteInventoryEntry(_id: String!): Inventory!
  }
`;

export const inventoryMutationResolvers = {
    Mutation: {
        createInventoryEntry: async (_parent: unknown, args: { company_id: string, product_id: string, quantity: number, event_hash: string }) => {
            const entry = await Inventory.create(args);
            return entry;
        },
        updateInventoryEntry: async (_parent: unknown, args: { _id: string, quantity: number, event_hash: string }) => {
            const entry = await Inventory.findOneAndUpdate( { _id: args._id, deleted_at: null }, { quantity: args.quantity, event_hash: args.event_hash }, { new: true }).lean();
            return entry;
        },
        deleteInventoryEntry: async (_parent: unknown, args: { _id: string }) => {
            const entry = await Inventory.findOneAndUpdate( { _id: args._id, deleted_at: null }, { deleted_at: new Date() }, { new: true }).lean();
            return entry;
        },
    },
};