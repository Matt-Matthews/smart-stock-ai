import { prisma } from "@configs/mysql-db.config.js";
import { hashPassword } from "@utils/password.util.js";

export const profileMutation = `#graphql
  input UpdateProfileInput {
    first_name: String
    last_name: String
    email: String
    password: String
  }

  extend type Mutation {
    updateProfile(id: String!, input: UpdateProfileInput!): User!
  }
`;

export const profileMutationResolvers = {
    Mutation: {
        updateProfile: async (_parent: unknown, args: { id: string, input: Record<string, string> }) => {
            const data = { ...args.input } as Record<string, string>;
            if (data.password) data.password = await hashPassword(data.password);
            else delete data.password;
            return prisma.user.update({ where: { id: args.id }, data, include: { role: true } });
        },
    },
};