import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
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
    event_hash: {
        type: String,
        required: false,
        trim: true
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

const Inventory = mongoose.model('Inventory', transactionSchema);
export default Inventory;