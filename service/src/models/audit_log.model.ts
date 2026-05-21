import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const auditLogSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4()
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    action: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    _id: false,
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;