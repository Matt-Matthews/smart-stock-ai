import Inventory from "@models/inventory.model.js";
import Product from "@models/product.model.js";

export const inventoryQuery = `#graphql
  extend type Query {
    inventory: [Inventory!]!
    inventoryEntry(_id: String!): Inventory
    inventoryByCompany(company_id: String!): [InventoryWithProductDetails!]!
    inventoryByProduct(product_id: String!): [Inventory!]!
    inventoryWithProductDetails: [InventoryWithProductDetails!]!
  }

    type InventoryWithProductDetails {
    _id: String!
    company_id: String!
    product_id: String!
    quantity: Int!
    created_at: String
    updated_at: String
    deleted_at: String
    product: Product
    event_hash: String
    }
`;

export const inventoryQueryResolvers = {
    Query: {
        inventory: async () => await Inventory.find({ deleted_at: null }).lean(),
        inventoryEntry: async (_parent: unknown, args: { _id: string }) =>
            await Inventory.findOne({ _id: args._id, deleted_at: null }).lean(),
        inventoryByCompany: async (_parent: unknown, args: { company_id: string }) =>{
            const entries = await Inventory.find({ deleted_at: null, company_id: args.company_id }).lean();
            const productIds = entries.map(entry => entry.product_id);
            const products = await Product.find({ _id: { $in: productIds }, deleted_at: null }).lean();
            const productMap = new Map(products.map(product => [product._id.toString(), product]));
            return entries.map(entry => ({
                ...entry,
                product: productMap.get(entry.product_id.toString()) || null,
            }));
        },
        inventoryByProduct: async (_parent: unknown, args: { product_id: string }) =>
            await Inventory.find({ product_id: args.product_id, deleted_at: null }).lean(),
        inventoryWithProductDetails: async () => {
            const entries = await Inventory.find({ deleted_at: null }).lean();
            const productIds = entries.map(entry => entry.product_id);
            const products = await Product.find({ _id: { $in: productIds }, deleted_at: null }).lean();
            const productMap = new Map(products.map(product => [product._id.toString(), product]));
            return entries.map(entry => ({
                ...entry,
                product: productMap.get(entry.product_id.toString()) || null,
            }));
        },
    },
};