import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;
const transactionSchema = new Schema({
    company_id: {
        type: String,
        required: true,
        ref: 'Company'
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    product_id: {
        type: String,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    transaction_type: {
        type: String,
        enum: ['sale', 'purchase'],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    },
}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;