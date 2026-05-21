import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const userSchema = new Schema({
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
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role_id: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
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
    }, 
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    _id: false,
});

const User = mongoose.model('User', userSchema);

export default User;