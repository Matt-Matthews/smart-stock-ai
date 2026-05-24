// import { IAccessTokenData, IRefreshTokenData, IRefreshTokenResult } from '@typeDefs/tokenTypes';

import jwt from 'jsonwebtoken';



/**
 * Generate access token to be used as Authorization header.
 *
 * @param {any} user - A user object.
 * @returns {string} - The access token string.
 */
export const generateAccessToken = (user: any): { token: string, expiresIn: number } => {
    const expiresIn = Date.now() + 1000 * 60 * 15;
    return {
        token: jwt.sign(
            {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                // userRole: user.user_role.access_role.name,
                expiresIn: expiresIn,
                timestamp: Date.now(),
                issuer: 'identity-service'
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: '15m'
            }
        ),
        expiresIn
    }
}



/**
 * Generate a refresh token.
 *
 * @param {string} userId - A user Id.
 * @param {string} tokenId - A token Id.
 * @returns {IRefreshTokenResult} - The refresh token data and refresh token string.
 */
export const generateRefreshToken = (userId: string, tokenId: string): any => {

    const refreshTokenData = {
        userId,
        tokenId,
        expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 7,
        timestamp: Date.now(),
        issuer: 'identity-service',
    }

    const refreshToken = jwt.sign(
        refreshTokenData,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: '7d'
        }
    );

    return {
        refreshToken,
        refreshTokenData
    }
}


/**
 * Verify tokens.
 *
 * @param {string} token - Access token or refresh token.
 * @returns {string | JwtPayload} - The token data.
 */
export const verifyToken = (token: string): string | any => {

    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch (error: any) {

        if (error.name === 'TokenExpiredError') {
            return 'expired';
        }
        return 'unknown';
    }

}

function convertToken(token: string) {
    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload as string);
    return JSON.parse(decodedPayload);
}

export const decodeToken = (token: string) => {
    if (!token) return { success: false, data: {} };
    const user = convertToken(token);

    return { success: true, data: user };
}