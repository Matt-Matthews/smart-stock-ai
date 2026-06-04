import type { User } from "./userTypes";

export interface DecodedToken {
    exp: number;
    expiresIn: number;
    iat: number;
    issuer: string;
    timestamp: number;
    user: User
}
