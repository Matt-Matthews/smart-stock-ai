import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import createUserService from "@services/users/create-user.service.js";
import createCompanyService from "@services/companies/create-company.service.js";
import { AppError } from "@utils/error.util.js";

const bodyValidationRules = [
    body('firstName').notEmpty().isString().withMessage('First name must be a valid string'),
    body('lastName').notEmpty().isUUID().withMessage('Last name must be a valid UUID v7'),
    body('email').notEmpty().isString().withMessage('Email Id must be a valid string'),
    body('password').notEmpty().isString().withMessage('Password must be a valid string'),
    body('companyId').optional().isString().withMessage('Company Id must be a valid string'),
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
            throw new AppError("Invalid parameters", 400, "error");
        }

        if (!req.body.companyId && !req.body.company) {
            throw new AppError("Either companyId or company details must be provided", 400, "error");
        }
        let companyId = req.body.companyId;
        let company = req.body.company;

        // If company details are provided, create a new company
        if (company) {
            const companyResult = await createCompanyService(company);
            if (companyResult.statusCode !== 201) {
                throw new AppError("Failed to create company", 500, "error");
            }
            companyId = companyResult.data.id;
        }

        const result = await createUserService({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            companyId: companyId || "",
        });

        res.status(result.statusCode).json(result);
    } catch (error: any) {
        res.status(error.statusCode).json(error);
    }
}
export default [...bodyValidationRules, register];