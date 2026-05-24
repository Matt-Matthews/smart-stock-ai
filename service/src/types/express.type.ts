import * as express from 'express';
// import { IDecodedUser } from './userTypes';

declare global {
    namespace Express {
        interface Request {
            user?: any; 
        }
    }
}