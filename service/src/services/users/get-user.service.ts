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