import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const productSchema = new Schema({
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
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    cost_price: {
        type: Number,
        required: true,
        min: 0
    },
    selling_price: {
        type: Number,
        required: true,
        min: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    barcode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    reorder_level: {
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

const Product = mongoose.model('Product', productSchema);
export default Product;