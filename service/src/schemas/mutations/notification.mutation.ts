import { prisma } from "@configs/mysql-db.config.js";

export const notificationMutation = `#graphql
  extend type Mutation {
    createNotification(user_id: String!, company_id: String!, title: String!, message: String!, type: String): Notification!
    markNotificationRead(id: String!): Notification!
    markAllNotificationsRead(user_id: String!): Boolean!
  }
`;

export const notificationMutationResolvers = {
    Mutation: {
        createNotification: async (_parent: unknown, args: { user_id: string, company_id: string, title: string, message: string, type?: string }) =>
            await (prisma as any).notification.create({ data: args }),
        markNotificationRead: async (_parent: unknown, args: { id: string }) =>
            await (prisma as any).notification.update({ where: { id: args.id }, data: { read_at: new Date() } }),
        markAllNotificationsRead: async (_parent: unknown, args: { user_id: string }) => {
            await (prisma as any).notification.updateMany({ where: { user_id: args.user_id, read_at: null, deleted_at: null }, data: { read_at: new Date() } });
            return true;
        },
    },
};