import { prisma } from "@configs/mysql-db.config.js";

export const notificationQuery = `#graphql
  extend type Query {
    notificationsByUser(user_id: String!): [Notification!]!
    unreadNotificationsByUser(user_id: String!): [Notification!]!
  }
`;

export const notificationQueryResolvers = {
    Query: {
        notificationsByUser: async (_parent: unknown, args: { user_id: string }) =>
            await (prisma as any).notification.findMany({ where: { user_id: args.user_id, deleted_at: null }, orderBy: { created_at: 'desc' } }),
        unreadNotificationsByUser: async (_parent: unknown, args: { user_id: string }) =>
            await (prisma as any).notification.findMany({ where: { user_id: args.user_id, read_at: null, deleted_at: null }, orderBy: { created_at: 'desc' } }),
    },
};