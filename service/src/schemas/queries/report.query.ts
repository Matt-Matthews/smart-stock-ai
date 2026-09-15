import { prisma } from "@configs/mysql-db.config.js";

export const reportQuery = `#graphql
  extend type Query {
    reports: [Report!]!
    report(id: String!): Report
    reportsByCompany(company_id: String!): [Report!]!
  }
`;

export const reportQueryResolvers = {
    Query: {
        reports: async () => await prisma.reports.findMany({ where: { deleted_at: null } }),
        report: async (_parent: unknown, args: { id: string }) =>
            await prisma.reports.findFirst({ where: { id: args.id, deleted_at: null } }),
        reportsByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await prisma.reports.findMany({ where: { company_id: args.company_id, deleted_at: null } }),
    },
};