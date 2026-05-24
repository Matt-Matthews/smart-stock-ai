import type { Request, Response } from "express";
import { validatePassword } from "@utils/password.util.js";
import getUserByEmail from "@services/users/get-user.service.js";
import { generateAccessToken, generateRefreshToken } from "@utils/token.util.js";
import { v7 as uuid } from "uuid";


const login = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ status: 'error', message: 'Authentication required' });
        }

        // Header format is "Basic <base64>"
        const base64Credentials = authHeader.split(' ')[1];

        if (!base64Credentials) {
            return res.status(401).json({ status: 'error', message: 'Invalid authentication header format' });
        }

        const [email, password] = Buffer.from(base64Credentials, 'base64')
            .toString('ascii')
            .split(':');
        if (!email || !password) {
            return res.status(401).json({ status: 'error', message: 'Email and password are required' });
        }

        const user = await getUserByEmail({ email });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const isPasswordValid = await validatePassword(password, user.data.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.data.id, email: user.data.email, role: user.data.role_id });
        const refreshTokenResult = generateRefreshToken(user.data.id, uuid());

        res.cookie('refreshToken', refreshTokenResult, { httpOnly: true, secure: true, sameSite: 'none' });
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.status(200).send({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: accessToken.token,
                expiresIn: accessToken.expiresIn
            }
        });

    } catch (error: any) {
        res.status(error.statusCode || 500).json(error);
    }
}

export default login;