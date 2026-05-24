import Company from "@models/company.model.js";
import Product from "@models/product.model.js";
import Transaction from "@models/transaction.model.js";

export const transactionQuery = `#graphql
  extend type Query {
    transactions: [Transaction!]!
    transaction(_id: String!): TransactionWithProductDetails
    transactionsByCompany(company_id: String!): [Transaction!]!
    transactionsByProduct(product_id: String!): [Transaction!]!
    transactionsWithProductDetails: [TransactionWithProductDetails!]!
  }

    type TransactionWithProductDetails {
    _id: String!
    company_id: String!
    product_id: String!
    quantity: Int!
    created_at: String
    updated_at: String
    deleted_at: String
    product: Product
    company: Company
    }
`;

export const transactionQueryResolvers = {
    Query: {
        transactions: async () => await Transaction.find({ deleted_at: null }).lean(),
        transaction: async (_parent: unknown, args: { _id: string }) => {
            const transaction = await Transaction.findOne({ _id: args._id, deleted_at: null }).lean();
            if (!transaction) return null;
            const product = await Product.findOne({ _id: transaction.product_id, deleted_at: null }).lean();
            const company = await Company.findOne({ _id: transaction.company_id, deleted_at: null }).lean();
            return {
                ...transaction,
                product,
                company
            };
        },
        transactionsByCompany: async (_parent: unknown, args: { company_id: string }) =>
            await Transaction.find({ company_id: args.company_id, deleted_at: null }).lean(),
        transactionsByProduct: async (_parent: unknown, args: { product_id: string }) =>
            await Transaction.find({ product_id: args.product_id, deleted_at: null }).lean(),
        transactionsWithProductDetails: async (_parent: unknown, args: { company_id?: string }) => {
            const transactions = await Transaction.find({ deleted_at: null, ...(args.company_id && { company_id: args.company_id }) }).lean();
            const productIds = transactions.map(transaction => transaction.product_id);
            const products = await Product.find({ _id: { $in: productIds }, deleted_at: null }).lean();
            const productMap = new Map(products.map(product => [product._id.toString(), product]));
            const company = args.company_id ? await Company.findOne({ _id: args.company_id, deleted_at: null }).lean() : null;
            return transactions.map(transaction => ({
                ...transaction,
                product: productMap.get(transaction.product_id.toString()) || null,
                company
            }));
        }
    },
};