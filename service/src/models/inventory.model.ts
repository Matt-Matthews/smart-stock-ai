import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const transactionSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4()
    },
    company_id: {
        type: String,
        required: true,
        ref: 'Company'
    },
    product_id: {
        type: String,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
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
    _id: false,
});

const Inventory = mongoose.model('Inventory', transactionSchema);
export default Inventory;