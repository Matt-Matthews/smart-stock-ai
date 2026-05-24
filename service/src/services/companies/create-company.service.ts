import Company from "@models/company.model.js";
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';


const createCompany = async (companyData: { name: string, address: string, phone: string, email: string }): Promise<IServiceResult> => {
    try {
        const existingCompany = await Company.findOne({ email: companyData.email });
        if (existingCompany) {
            return serviceResult(400, "error", "Email already in use", null);
        }

        const company = new Company({
            name: companyData.name,
            address: companyData.address,
            phone: companyData.phone,
            email: companyData.email
        });
        await company.save();
        return serviceResult(201, "success", "Company created successfully", company);
    } catch (error) {
        return serviceResult(500, "error", "Failed to create company", null);
    }
};

export default createCompany;