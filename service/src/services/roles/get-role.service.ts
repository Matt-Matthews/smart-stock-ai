import Role from '@models/role.model.js';
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';

const getRole = async (data: { roleId?: string, name?: string }): Promise<IServiceResult> => {
    try {
        const role = await Role.findOne(
            {
               ...(data.roleId ? { _id: data.roleId } : {}),
               ...(data.name ? { name: data.name } : {}),
            },
        ).populate('permissions');
        if (!role) {
            return serviceResult(404, "error", "Role not found", null);
        }
        const roleObj: any = role.toObject();
        roleObj._id = roleObj._id.toString();
        return serviceResult(200, "success", "Role retrieved successfully", roleObj);
    } catch (error) {
        return serviceResult(500, "error", "Failed to retrieve role", null, error);
    }
}

export default getRole;