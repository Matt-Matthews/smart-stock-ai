import Company from "@models/company.model.js";
import type { IServiceResult } from '@typeDefs/request-result.type.js';
import { serviceResult } from '@utils/request-result.util.js';


const createCompany = async (companyData: { name: string, address: string, phone: string, email: string }): Promise<IServiceResult> => {
    try {
        const existingCompany = await Company.findOne({ email: companyData.email });
        if (existingCompany) {
            return serviceResult(400, "error", "Email already in use", null);
        }

        const company = await Company.create({
            name: companyData.name,
            address: companyData.address,
            phone: companyData.phone,
            email: companyData.email
        });
        const companyObj: any = company.toObject();
        companyObj._id = companyObj._id.toString();

        return serviceResult(201, "success", "Company created successfully", companyObj);
    } catch (error) {
        return serviceResult(500, "error", "Failed to create company", null);
    }
};

export default createCompany;