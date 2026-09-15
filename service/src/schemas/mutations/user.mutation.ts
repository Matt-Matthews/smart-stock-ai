import { prisma } from "@configs/mysql-db.config.js";
import {hashPassword} from "@utils/password.util.js";

export const userMutation = `#graphql
  extend type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(id: String!, input: UpdateUserInput!): User!
    deleteUser(id: String!): User!
  }

    input CreateUserInput {
        first_name: String!
        last_name: String!
        email: String!
        password: String!
        company_id: String!
        role_id: String!
    }

    input UpdateUserInput {
        first_name: String
        last_name: String
        email: String
        password: String
        role_id: String
    }
`;

export const userMutationResolvers = {
    Mutation: {
        createUser: async (_parent: unknown, args: { input: { first_name: string, last_name: string, email: string, password: string, role_id: string, company_id: string } }) => {
            const hashedPassword = await hashPassword(args.input.password);
            const user = await prisma.user.create({
                data: {
                    ...args.input,
                    password: hashedPassword
                },
                include: { role: true }
            });
            return user;
        },
        updateUser: async (_parent: unknown, args: { id: string, input: { first_name?: string, last_name?: string, email?: string, password?: string, role_id?: string } }) => {
            const { password, ...data } = args.input;
            const user = await prisma.user.update({
                where: { id: args.id },
                data: password ? { ...data, password: await hashPassword(password) } : data,
                include: { role: true }
            });
            return user;
        },
        deleteUser: async (_parent: unknown, args: { id: string }) => {
            const user = await prisma.user.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                },
                include: { role: true }
            });
            return user;
        },
    },
};