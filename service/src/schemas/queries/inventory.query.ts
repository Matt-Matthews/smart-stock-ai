import { prisma } from "@configs/mysql-db.config.js";


export const inventoryQuery = `#graphql
  extend type Query {
    inventory: [Inventory!]!
    inventoryEntry(id: String!): Inventory
    inventoryByCompany(company_id: String!): [Inventory!]!
    inventoryByProduct(item_id: String!): [Inventory!]!
  }
`;

export const inventoryQueryResolvers = {
    Query: {
        inventory: async () => await prisma.inventory.findMany({ where: { deleted_at: null } }),
        inventoryEntry: async (_parent: unknown, args: { id: string }) =>
            await prisma.inventory.findUnique({
                where: { id: args.id, deleted_at: null }, include: {
                    transactions: { where: { deleted_at: null }, orderBy: { created_at: 'desc' } },
                    item: {
                        include: {
                            category: true,
                            currency: true
                        }
                    }
                }
            }),
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
        inventoryByProduct: async (_parent: unknown, args: { item_id: string }) =>
            await prisma.inventory.findMany({ where: { deleted_at: null, item_id: args.item_id } }),
    },
};