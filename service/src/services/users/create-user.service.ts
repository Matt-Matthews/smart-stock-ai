
import { hashPassword } from '@utils/password.util.js';
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';
import type { IAddUser } from '@typeDefs/user.type.js';
import getRoleService from '@services/roles/get-role.service.js';
import {prisma} from '@configs/mysql-db.config.js';
import type { User } from '@configs/generated/prisma/index.js';

const createUser = async (userData: IAddUser): Promise<IServiceResult<User>> => {
    try {
        let roleId = userData.userRoleId;
        if (!userData.userRoleId) {
           const roleResult = await getRoleService({ name: 'admin' });
            if (roleResult.status !== "success" || !roleResult.data) {
                return serviceResult(roleResult.statusCode, "error", roleResult.message, null);
            }
            roleId = roleResult?.data.id;
        }

        const existingUser = await prisma.user.findFirst({ where: { email: userData.email } });
        if (existingUser) {
            return serviceResult(400, "error", "Email already in use", null);
        }

        const hashedPassword = await hashPassword(userData.password);
        const user = await prisma.user.create({
            data: {
                password: hashedPassword,
                role_id: roleId as string,
                company_id: userData.companyId,
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email
            }
        });

        if (!user) {
            return serviceResult(500, "error", "Failed to create user", null);
        }

        return serviceResult(201, "success", "User created successfully", user);
    } catch (error) {
        return serviceResult(500, "error", "Failed to create user", null, error);
    }
}

export default createUser;