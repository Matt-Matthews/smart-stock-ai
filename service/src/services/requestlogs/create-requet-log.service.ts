import {prisma} from '@configs/mysql-db.config.js';
import type { IServiceResult } from "@typeDefs/request-result.type.js";
import { serviceResult } from "@utils/request-result.util.js";
import type { Prisma } from '@configs/generated/prisma/index.js';

const createRequestLog = async (logData: Prisma.RequestLogUncheckedCreateInput): Promise<IServiceResult> => {
    try {
        const existingLog = await prisma.requestLog.findFirst({ where: { request_id: logData.request_id } });
        if (existingLog) {
            return serviceResult(400, "error", "Request log with this ID already exists", null);
        }
        
        const log = await prisma.requestLog.create({
            data: logData
        });

        if (!log) {
            return serviceResult(400, "error", "Failed to create request log", null);
        }
        
        return serviceResult(201, "success", "Request log created successfully", log);
    }
    catch (error) {
        return serviceResult(500, "error", "Failed to create request log", null, error);
    }
}

export default createRequestLog;