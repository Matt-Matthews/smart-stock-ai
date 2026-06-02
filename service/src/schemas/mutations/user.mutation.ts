import { prisma } from "@configs/mysql-db.config.js";
import {hashPassword} from "@utils/password.util.js";

export const userMutation = `#graphql
  extend type Mutation {
    createUser(name: String!, email: String!, password: String!, role_id: String!): User!
    updateUser(id: String!, name: String, email: String, password: String, role_id: String): User!
    deleteUser(id: String!): User!
  }
`;

export const userMutationResolvers = {
    Mutation: {
        createUser: async (_parent: unknown, args: { first_name: string, last_name: string, email: string, password: string, role_id: string, company_id: string }) => {
            const hashedPassword = await hashPassword(args.password);
            const user = await prisma.user.create({
                data: {
                    ...args,
                    password: hashedPassword
                }
            });
            return user;
        },
        updateUser: async (_parent: unknown, args: { id: string, name?: string, email?: string, password?: string, role_id?: string }) => {
            const user = await prisma.user.update({
                where: { id: args.id, deleted_at: null },
                data: args
            });
            return user;
        },
        deleteUser: async (_parent: unknown, args: { id: string }) => {
            const user = await prisma.user.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                }
            });
            return user;
        },
    },
};