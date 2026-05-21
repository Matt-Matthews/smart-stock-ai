import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;


const requestLogSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4()
    },
    method: {
        type: String,
        required: true,
        trim: true
    },
    direction: {
        type: String,
        required: true,
        enum: ['inbound', 'outbound']
    },
    endpoint: {
        type: String,
        required: true,
        trim: true
    },
    status_code: {
        type: Number,
        required: true,
        min: 100,
        max: 599
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    request_timestamp: {
        type: Date,
        required: true,
    },
    response_timestamp: {
        type: Date,
        required: true,
    },
    request_headers: {
        type: Object,
        required: true
    },
    request_body: {
        type: Object,
        required: true
    },
    response_headers: {
        type: Object,
        required: true
    },
    response_body: {
        type: Object,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
    _id: false,
});

const RequestLog = mongoose.model('RequestLog', requestLogSchema);
export default RequestLog;