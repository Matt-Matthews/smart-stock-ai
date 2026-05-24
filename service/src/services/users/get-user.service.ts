import User from '@models/user.model.js';
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';

const getUser = async (data: { userId?: string, email?: string }): Promise<IServiceResult> => {
    try {
        const user = await User.findOne(
            {
                ...(data.userId ? { _id: data.userId } : {}),
                ...(data.email ? { email: data.email } : {})
            }
        ).populate('company_id', 'name').populate('role_id', 'name');

        if (!user) {
            return serviceResult(404, "error", "User not found", null);
        }

        const obj: any = user.toObject();
        const userObj: any = {
            _id: obj._id.toString(),
            company: obj.company_id ? { id: obj.company_id._id?.toString(), name: obj.company_id.name } : null,
            role: obj.role_id ? { id: obj.role_id._id?.toString(), name: obj.role_id.name } : null,
            role_id: obj.role_id ? obj.role_id._id?.toString() : null,
            company_id: obj.company_id ? obj.company_id._id?.toString() : null,
            first_name: obj.first_name,
            last_name: obj.last_name,
            email: obj.email,
            enabled: obj.enabled,
            created_at: obj.created_at,
            updated_at: obj.updated_at,
            deleted_at: obj.deleted_at,
            password: obj.password
        }
        return serviceResult(200, "success", "User retrieved successfully", userObj);
    } catch (error) {
        return serviceResult(500, "error", "Failed to retrieve user", null, error);
    }
}

export default getUser;