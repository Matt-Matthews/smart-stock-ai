import { prisma } from "@configs/mysql-db.config.js";

export const invoiceQuery = `#graphql
  extend type Query {
    invoices: [Invoice!]!
    invoice(id: String!): Invoice
    invoicesByCompany(company_id: String!): [Invoice!]!
    invoicesBySupplier(supplier_id: String!): [Invoice!]!
  }
`;

export const invoiceQueryResolvers = {
    Query: {
        invoices: async () => await prisma.invoices.findMany({ where: { deleted_at: null } }),
        invoice: async (_parent: unknown, args: { id: string }) =>
            await prisma.invoices.findFirst({ where: { id: args.id, deleted_at: null } }),
        invoicesByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await prisma.invoices.findMany({ where: { company_id: args.company_id, deleted_at: null } }),
        invoicesBySupplier: async (_parent: unknown, args: { supplier_id: string }) =>
            await prisma.invoices.findMany({ where: { supplier_id: args.supplier_id, deleted_at: null } }),
    },
};