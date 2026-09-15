import { prisma } from "@configs/mysql-db.config.js";

export const reportMutation = `#graphql
  extend type Mutation {
    createReport(company_id: String!, name: String!, description: String): Report!
    updateReport(id: String!, input: UpdateReportInput!): Report!
    deleteReport(id: String!): Report!
  }

  input UpdateReportInput {
    company_id: String
    name: String
    description: String
  }
`;

export const reportMutationResolvers = {
    Mutation: {
        createReport: async (_parent: unknown, args: { company_id: string, name: string, description?: string }) =>
            await prisma.reports.create({ data: args }),
        updateReport: async (_parent: unknown, args: { id: string, input: Record<string, any> }) =>
            await prisma.reports.update({ where: { id: args.id }, data: args.input }),
        deleteReport: async (_parent: unknown, args: { id: string }) =>
            await prisma.reports.update({ where: { id: args.id }, data: { deleted_at: new Date() } }),
    },
};