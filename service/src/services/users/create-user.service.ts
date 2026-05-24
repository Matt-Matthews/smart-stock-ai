import User from '@models/user.model.js';
import { hashPassword } from '@utils/password.util.js';
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';
import type { IAddUser } from '@typeDefs/user.type.js';
import getRoleService from '@services/roles/get-role.service.js';

const createUser = async (userData: IAddUser): Promise<IServiceResult> => {
    try {
        let roleId = userData.userRoleId;
        if (!userData.userRoleId) {
           const roleResult = await getRoleService({ name: 'admin' });
            if (roleResult.status !== "success") {
                return serviceResult(roleResult.statusCode, "error", roleResult.message, null);
            }
            roleId = roleResult.data.id.toString();
        }

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return serviceResult(400, "error", "Email already in use", null);
        }

        const hashedPassword = await hashPassword(userData.password);
        const user = new User({
            password: hashedPassword,
            role_id: roleId,
            company_id: userData.companyId,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email
        });

        await user.save();
        return serviceResult(201, "success", "User created successfully", user);
    } catch (error) {
        return serviceResult(500, "error", "Failed to create user", null, error);
    }
}

export default createUser;