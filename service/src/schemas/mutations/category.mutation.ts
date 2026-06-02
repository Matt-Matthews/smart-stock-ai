import { prisma } from "@configs/mysql-db.config.js";

export const categoryMutation = `#graphql
  extend type Mutation {
    createCategory(company_id: String!, name: String!, description: String): Category!
    updateCategory(id: String!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: String!): Category!
  }

  input UpdateCategoryInput {
    company_id: String
    name: String
    description: String
  }
  `;

export const categoryMutationResolvers = {
    Mutation: {
        createCategory: async (_parent: unknown, args: { company_id: string, name: string, description?: string }) => {
            const category = await prisma.category.create({
                data: args,
            });
            return category;
        }
        ,
        updateCategory: async (_parent: unknown, args: { id: string, input: Record<string, any> }) => {
            const category = await prisma.category.update({
                where: { id: args.id, deleted_at: null },
                data: args.input
            });
            return category;
        },
        deleteCategory: async (_parent: unknown, args: { id: string }) => {
            const category = await prisma.category.update({
                where: { id: args.id, deleted_at: null },
                data: {
                    deleted_at: new Date(),
                    enabled: false
                }
            });
            return category;
        },
    },
};