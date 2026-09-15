import { prisma } from "@configs/mysql-db.config.js";

export const dashboardQuery = `#graphql
  type DashboardSummary {
    total_stock_value: Float!
    low_stock_items: Int!
    transactions_today: Int!
    top_category: String
    top_category_value: Float!
    recent_transactions: [Transaction!]!
  }

  extend type Query {
    dashboardSummary(company_id: String!): DashboardSummary!
  }
`;

export const dashboardQueryResolvers = {
    Query: {
        dashboardSummary: async (_parent: unknown, args: { company_id: string }) => {
            const [inventory, lowStock, transactionsToday, recentTransactions] = await Promise.all([
                prisma.inventory.findMany({ where: { company_id: args.company_id, deleted_at: null }, include: { item: { include: { category: true } } } }),
                prisma.inventory.count({ where: { company_id: args.company_id, status: { in: ['Low Stock', 'Out of Stock'] }, deleted_at: null } }),
                prisma.transaction.count({ where: { company_id: args.company_id, created_at: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }, deleted_at: null } }),
                prisma.transaction.findMany({ where: { company_id: args.company_id, deleted_at: null }, orderBy: { created_at: 'desc' }, take: 5, include: { inventory: true } }),
            ]);
            const categoryValues = new Map<string, number>();
            inventory.forEach((entry: any) => categoryValues.set(entry.item.category_id, (categoryValues.get(entry.item.category_id) || 0) + entry.quantity * entry.item.sell_price));
            const top = [...categoryValues.entries()].sort((a, b) => b[1] - a[1])[0];
            const topEntry = inventory.find((entry: any) => entry.item.category_id === top?.[0]);
            return { total_stock_value: inventory.reduce((sum: number, entry: any) => sum + entry.quantity * entry.item.cost_price, 0), low_stock_items: lowStock, transactions_today: transactionsToday, top_category: topEntry?.item.category?.name || null, top_category_value: top?.[1] || 0, recent_transactions: recentTransactions };
        },
    },
};