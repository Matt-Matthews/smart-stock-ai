import type { Request, Response } from "express";
import { validatePassword } from "@utils/password.util.js";
import getUserByEmail from "@services/users/get-user.service.js";
import { generateAccessToken, generateRefreshToken } from "@utils/token.util.js";
import { v7 as uuid } from "uuid";
import listRolePermissionsService from "@services/role-permissions/list-role-permissions.service.js";


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
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const isPasswordValid = await validatePassword(user.data.password, password);
        console.log("is valid:::", isPasswordValid)
        console.log(password)
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const permissionsResult = await listRolePermissionsService({ roleId: user.data.roleId }, false);
        
        if (permissionsResult.status !== "success") {
            return res.status(permissionsResult.statusCode).json({ status: 'error', message: permissionsResult.message });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.data.id, email: user.data.email, firstName: user.data.first_name, lastName: user.data.last_name, role: user.data.role, permissions: permissionsResult.data });
        const refreshTokenResult = generateRefreshToken(user.data.id, uuid());

        res.cookie('refreshToken', refreshTokenResult, { httpOnly: true, secure: true, sameSite: 'none' });
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.status(200).send({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: accessToken.token,
                expiresIn: accessToken.expiresIn,
                user: {
                    firstName: user.data.firstName,
                    lastName: user.data.lastName,
                    email: user.data.email,
                    company: user.data.company
                }
            }
        });

    } catch (error: any) {
        console.error('Error during login:', error);
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'An error occurred during login', error: error });
    }
}

export default login;