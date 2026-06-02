import { prisma } from "@configs/mysql-db.config.js";


export const companyMutation = `#graphql
  extend type Mutation {
    createCompany(name: String!, address: String!, phone: String!, email: String!): Company!
    updateCompany(id: String!, name: String, address: String, phone: String, email: String): Company!
    deleteCompany(id: String!): Company!
  }
`;

export const companyMutationResolvers = {
    Mutation: {
        createCompany: async (_parent: unknown, args: { name: string, address: string, phone: string, email: string }) => {
            const company = await prisma.company.create({
                data: args,
            });
            return company;
        },
        updateCompany: async (_parent: unknown, args: { id: string, name?: string, address?: string, phone?: string, email?: string }) => {
            const company = await prisma.company.update({
                where: { id: args.id },
                data: args,
            });
            return company;
        },
        deleteCompany: async (_parent: unknown, args: { id: string }) => {
            const company = await prisma.company.update({
                where: { id: args.id },
                data: { deleted_at: new Date() },
            });
            return company;
        },
    },
};