import type { Request, Response, NextFunction } from 'express';



/**
 * Authenticate user.
 *
 * @param {Request} req - Request data.
 * @param {Response} res - Response data.
 * @param {NextFunction} next - Next function.
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        next();

    } catch (err: any) {

        res.status(500).json({
            status: 'error',
            message: 'Internal server error.',
            data: err
        })
    }
}