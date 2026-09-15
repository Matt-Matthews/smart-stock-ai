import { prisma } from "@configs/mysql-db.config.js";

export const supplierMutation = `#graphql
  extend type Mutation {
    createSupplier(company_id: String!, name: String!, description: String): Supplier!
    updateSupplier(id: String!, input: UpdateSupplierInput!): Supplier!
    deleteSupplier(id: String!): Supplier!
  }

  input UpdateSupplierInput {
    company_id: String
    name: String
    description: String
  }
`;

export const supplierMutationResolvers = {
    Mutation: {
        createSupplier: async (_parent: unknown, args: { company_id: string, name: string, description?: string }) =>
            await prisma.suppliers.create({ data: args }),
        updateSupplier: async (_parent: unknown, args: { id: string, input: Record<string, any> }) =>
            await prisma.suppliers.update({ where: { id: args.id }, data: args.input }),
        deleteSupplier: async (_parent: unknown, args: { id: string }) =>
            await prisma.suppliers.update({ where: { id: args.id }, data: { deleted_at: new Date() } }),
    },
};