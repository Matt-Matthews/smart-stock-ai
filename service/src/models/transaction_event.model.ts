import mongoose from 'mongoose';

const transactionEventSchema = new mongoose.Schema({
    company_id: {
        type: String,
        required: true,
        ref: 'Company'
    },
    inventory_id: {
        type: String,
        required: true,
        ref: 'Inventory'
    },
    event_type: {
        type: String,
        required: true,
        trim: true
    },
    event_data: {
        type: Object,
        required: true,
        trim: true
    }, 
    event_timestamp: {
        type: Date,
        default: Date.now
    },
    event_hash: {
        type: String,
        required: true,
        trim: true
    },
    prev_event_hash: {
        type: String,
        required: false,
        trim: true
    },

}, { timestamps: true });

const TransactionEvent = mongoose.model('TransactionEvent', transactionEventSchema);
export default TransactionEvent;