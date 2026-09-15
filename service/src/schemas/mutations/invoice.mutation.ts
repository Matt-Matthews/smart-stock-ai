import { prisma } from "@configs/mysql-db.config.js";

export const invoiceMutation = `#graphql
  extend type Mutation {
    createInvoice(supplier_id: String!, company_id: String!, amount: Float!, vat: Float!, total: Float!): Invoice!
    updateInvoice(id: String!, input: UpdateInvoiceInput!): Invoice!
    deleteInvoice(id: String!): Invoice!
  }

  input UpdateInvoiceInput {
    supplier_id: String
    company_id: String
    amount: Float
    vat: Float
    total: Float
  }
`;

export const invoiceMutationResolvers = {
    Mutation: {
        createInvoice: async (_parent: unknown, args: { supplier_id: string, company_id: string, amount: number, vat: number, total: number }) =>
            await prisma.invoices.create({ data: args }),
        updateInvoice: async (_parent: unknown, args: { id: string, input: Record<string, any> }) =>
            await prisma.invoices.update({ where: { id: args.id }, data: args.input }),
        deleteInvoice: async (_parent: unknown, args: { id: string }) =>
            await prisma.invoices.update({ where: { id: args.id }, data: { deleted_at: new Date() } }),
    },
};