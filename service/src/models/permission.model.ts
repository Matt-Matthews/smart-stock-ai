import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;


const permissionSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4()
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
},{
    timestamps: true,
    _id: false,
})

const Permission = mongoose.model('Permission', permissionSchema);
export default Permission;