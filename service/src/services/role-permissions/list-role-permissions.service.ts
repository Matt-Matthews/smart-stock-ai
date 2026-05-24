import RolePermission from "@models/role-permission.model.js";
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';

const listRolePermissions = async (data: { roleId?: string, permissionId?: string, rolePermissionId?: string }, includeTimestamps: boolean = true): Promise<IServiceResult> => {
    try {
        const query: any = {
            ...(data.rolePermissionId ? { _id: data.rolePermissionId } : {}),
            ...(data.roleId ? { role_id: data.roleId } : {}),
            ...(data.permissionId ? { permission_id: data.permissionId } : {})
        };

        const rolePermissions = await RolePermission.find(query).populate('permission_id', 'name');

        const result = rolePermissions.map(rp => {
            const obj: any = rp.toObject();
            return {
                id: obj._id.toString(),
                role_id: obj.role_id ? obj.role_id.toString() : null,
                permission: obj.permission_id ? { id: obj.permission_id._id.toString(), name: obj.permission_id.name } : null,
                ...(includeTimestamps ? { created_at: obj.created_at, updated_at: obj.updated_at, deleted_at: obj.deleted_at } : {})
            }
        });

        return serviceResult(200, "success", "Role permissions retrieved successfully", result);
    } catch (error) {
        return serviceResult(500, "error", "Failed to retrieve role permissions", null, error);
    }
}

export default listRolePermissions;