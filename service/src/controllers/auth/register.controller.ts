import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import createUserService from "@services/users/create-user.service.js";
import createCompanyService from "@services/companies/create-company.service.js";

const bodyValidationRules = [
    body('firstName').notEmpty().isString().withMessage('First name must be a valid string'),
    body('lastName').notEmpty().isString().withMessage('Last name must be a valid string'),
    body('email').notEmpty().isString().withMessage('Email Id must be a valid string'),
    body('password').notEmpty().isString().withMessage('Password must be a valid string'),
    body('companyId').optional().isString().withMessage('Company Id must be a valid string'),
    body('roleId').optional().isString().withMessage('Role Id must be a valid string'),
    body('company').optional().isObject().withMessage('Company must be a valid object'),
    body('company.name').notEmpty().isString().withMessage('Company name must be a valid string'),
    body('company.address').notEmpty().isString().withMessage('Company address must be a valid string'),
    body('company.phone').notEmpty().isString().withMessage('Company phone must be a valid string'),
    body('company.email').notEmpty().isString().withMessage('Company email must be a valid string'),

];

const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
        }
        

        if (!req.body.companyId && !req.body.company) {
            return res.status(400).json({ status: 'error', message: 'Either companyId or company details must be provided' });
        }
        let companyId = req.body.companyId;
        let company = req.body.company;

        // If company details are provided, create a new company
        if (company) {
            const companyResult = await createCompanyService(company);
            
            if (companyResult.statusCode !== 201) {
                return res.status(500).json({ status: 'error', message: 'Failed to create company' });
            }
            companyId = companyResult.data.id;

            
        }

        const result = await createUserService({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            companyId: companyId || "",
            userRoleId: req.body.roleId
        });
        

        res.status(result.statusCode).json(result);
    } catch (error: any) {
        res.status(error.statusCode).json({ status: 'error', message: error.message || 'An error occurred during registration', error: error });
    }
}
export default [...bodyValidationRules, register];