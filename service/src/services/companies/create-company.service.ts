import { prisma } from '@configs/mysql-db.config.js';
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';
import type { Company } from '@configs/generated/prisma/index.js';


const createCompany = async (companyData: { name: string, address: string, phone: string, email: string, description?: string, }): Promise<IServiceResult<Company>> => {
    try {
        const existingCompany = await prisma.company.findUnique({ where: { email: companyData.email } });
        if (existingCompany) {
            return serviceResult(400, "error", "Email already in use", null);
        }

        const company = await prisma.company.create({
            data: {
                name: companyData.name,
                address: companyData.address,
                phone: companyData.phone,
                email: companyData.email,
                description: companyData.description || null,
            }
        });


        if (!company) {
            return serviceResult(500, "error", "Failed to create company", null);
        }

        return serviceResult(201, "success", "Company created successfully", company);
    } catch (error) {
        return serviceResult(500, "error", "Failed to create company", null);
    }
};

export default createCompany;