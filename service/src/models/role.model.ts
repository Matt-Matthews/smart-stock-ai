import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    company_id: {
        type: String,
        required: false,
        ref: 'Company'
    },
    description: {
        type: String,
        required: true,
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
    enabled: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
    }
);

const Role = mongoose.model('Role', roleSchema);
export default Role;