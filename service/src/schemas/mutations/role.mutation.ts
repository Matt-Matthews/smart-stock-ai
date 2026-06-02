import { prisma } from "@configs/mysql-db.config.js";

export const roleMutation = `#graphql
  extend type Mutation {
    createRole(company_id: String, description: String!): Role!
    updateRole(id: String!, company_id: String, description: String): Role!
    deleteRole(id: String!): Role!
  }
`;

export const roleMutationResolvers = {
    Mutation: {
        createRole: async (_parent: unknown, args: { company_id?: string, description: string, name: string }) => {
            const role = await prisma.role.create({
                data: args
            });
            return role;
        },
        updateRole: async (_parent: unknown, args: { id: string, company_id?: string, description?: string }) => {
            const role = await prisma.role.update({
                where: { id: args.id, deleted_at: null },
                data: args
            });
            return role;
        },
        deleteRole: async (_parent: unknown, args: { id: string }) => {
            const role = await prisma.role.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                }
            });
            return role;
        }
    },
};