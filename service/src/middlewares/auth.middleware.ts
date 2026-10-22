import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@utils/token.util.js';

/**
 * Authenticate user.
 *
 * @param {Request} req - Request data.
 * @param {Response} res - Response data.
 * @param {NextFunction} next - Next function.
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.get('authorization') ?? req.get('token');
    const accessToken = authorization?.replace(/^Bearer\s+/i, '').trim();
    if (!accessToken) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication required.'
        });
    }

    const decoded = verifyToken(accessToken);
    const user = typeof decoded === 'string' ? null : decoded?.user;
    const userId = user?.id ?? user?._id;
    const companyId =
        user?.company_id ??
        user?.companyId ??
        user?.company?.id ??
        user?.company?.company_id;
    if (
        !user ||
        typeof userId !== 'string' ||
        !userId ||
        typeof companyId !== 'string' ||
        !companyId
    ) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired access token.'
        });
    }

    res.locals.accessToken = accessToken;
    res.locals.authenticatedUser = {
        ...user,
        id: userId,
        company_id: companyId
    };
    next();
}