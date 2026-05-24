import type { Request, Response } from "express";


const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
        res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'An error occurred during logout', error: error });
    }
}

export default logout;