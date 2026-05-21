import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const roleSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            default: uuidv4()
        },
        role_id: {
            type: String,
            required: true,
            ref: 'Role'
        },
        permission_id: {
            type: String,
            required: true,
            ref: 'Permission'
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
        _id: false,
    }
);

const RolePermission = mongoose.model('RolePermission', roleSchema);
export default RolePermission;