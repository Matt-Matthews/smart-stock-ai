
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';
import type { User } from '@configs/generated/prisma/index.js';
import { prisma } from '@configs/mysql-db.config.js';

const getUser = async (data: { userId?: string, email?: string, includeRoles: boolean }): Promise<IServiceResult<User>> => {
    try {
        const user = await prisma.user.findFirst(
            {
                where: {
                    ...(data.userId ? { _id: data.userId } : {}),
                    ...(data.email ? { email: data.email } : {})
                },
                include: {
                    company: true,
                    role: data.includeRoles ? {
                        include: {
                            permissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    }: false
                }
            }
        );

        if (!user) {
            return serviceResult(404, "error", "User not found", null);
        }

        return serviceResult(200, "success", "User retrieved successfully", user);
    } catch (error) {
        return serviceResult(500, "error", "Failed to retrieve user", null, error);
    }
}

export default getUser;