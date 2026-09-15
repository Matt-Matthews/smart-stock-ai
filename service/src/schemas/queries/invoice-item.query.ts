import { prisma } from "@configs/mysql-db.config.js";

export const invoiceItemQuery = `#graphql
  extend type Query {
    invoiceItems: [InvoiceItem!]!
    invoiceItem(id: String!): InvoiceItem
    invoiceItemsByInvoice(invoice_id: String!): [InvoiceItem!]!
    invoiceItemsByItem(item_id: String!): [InvoiceItem!]!
  }
`;

export const invoiceItemQueryResolvers = {
    Query: {
        invoiceItems: async () => await prisma.invoice_items.findMany({ where: { deleted_at: null } }),
        invoiceItem: async (_parent: unknown, args: { id: string }) =>
            await prisma.invoice_items.findFirst({ where: { id: args.id, deleted_at: null } }),
        invoiceItemsByInvoice: async (_parent: unknown, args: { invoice_id: string }) =>
            await prisma.invoice_items.findMany({ where: { invoice_id: args.invoice_id, deleted_at: null } }),
        invoiceItemsByItem: async (_parent: unknown, args: { item_id: string }) =>
            await prisma.invoice_items.findMany({ where: { item_id: args.item_id, deleted_at: null } }),
    },
};