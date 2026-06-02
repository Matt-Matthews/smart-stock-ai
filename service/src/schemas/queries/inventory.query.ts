import { prisma } from "@configs/mysql-db.config.js";


export const inventoryQuery = `#graphql
  extend type Query {
    inventory: [Inventory!]!
    inventoryEntry(id: String!): Inventory
    inventoryByCompany(company_id: String!): [InventoryWithProductDetails!]!
    inventoryByProduct(product_id: String!): [Inventory!]!
  }

    type InventoryWithProductDetails {
    id: String!
    company_id: String!
    product_id: String!
    quantity: Int!
    created_at: String
    updated_at: String
    deleted_at: String
    item: Product
    event_hash: String
    }
`;

export const inventoryQueryResolvers = {
    Query: {
        inventory: async () => await prisma.inventory.findMany({ where: { deleted_at: null } }),
        inventoryEntry: async (_parent: unknown, args: { id: string }) =>
            await prisma.inventory.findUnique({ where: { id: args.id, deleted_at: null } }),
        inventoryByCompany: async (_parent: unknown, args: { company_id: string }) => {
            const entries = await prisma.inventory.findMany({
                where: { deleted_at: null, company_id: args.company_id },
                include: {
                    item: {
                        include: {
                            category: true,
                            currency: true
                        }
                    }
                }
            });
            return entries;
        },
        inventoryByProduct: async (_parent: unknown, args: { product_id: string }) =>
            await prisma.inventory.findMany({ where: { deleted_at: null, product_id: args.product_id } }),
    },
};