import { prisma } from '@configs/mysql-db.config.js';
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';
import type { Role } from '@configs/generated/prisma/index.js';

const getRole = async (data: { roleId?: string, name?: string }): Promise<IServiceResult<Role>> => {
    try {
        const role = await prisma.role.findFirst(
            {
                where: {
                    ...(data.roleId ? { _id: data.roleId } : {}),
                    ...(data.name ? { name: data.name } : {}),
                }
            },
        );

        if (!role) {
            return serviceResult(404, "error", "Role not found", null);
        }
        
        return serviceResult(200, "success", "Role retrieved successfully", role);
    } catch (error) {
        return serviceResult(500, "error", "Failed to retrieve role", null, error);
    }
}

export default getRole;