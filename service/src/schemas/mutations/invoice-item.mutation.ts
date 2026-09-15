import { prisma } from "@configs/mysql-db.config.js";

export const invoiceItemMutation = `#graphql
  extend type Mutation {
    createInvoiceItem(invoice_id: String!, item_id: String!, quantity: Int!, price: Float!): InvoiceItem!
    updateInvoiceItem(id: String!, input: UpdateInvoiceItemInput!): InvoiceItem!
    deleteInvoiceItem(id: String!): InvoiceItem!
  }

  input UpdateInvoiceItemInput {
    invoice_id: String
    item_id: String
    quantity: Int
    price: Float
  }
`;

export const invoiceItemMutationResolvers = {
    Mutation: {
        createInvoiceItem: async (_parent: unknown, args: { invoice_id: string, item_id: string, quantity: number, price: number }) =>
            await prisma.invoice_items.create({ data: args }),
        updateInvoiceItem: async (_parent: unknown, args: { id: string, input: Record<string, any> }) =>
            await prisma.invoice_items.update({ where: { id: args.id }, data: args.input }),
        deleteInvoiceItem: async (_parent: unknown, args: { id: string }) =>
            await prisma.invoice_items.update({ where: { id: args.id }, data: { deleted_at: new Date() } }),
    },
};