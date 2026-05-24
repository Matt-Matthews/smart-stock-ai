import RequestLog from "@models/request_log.model.js";
import type { IServiceResult } from "@typeDefs/request-result.type.js";
import { serviceResult } from "@utils/request-result.util.js";

const createRequestLog = async (logData: any): Promise<IServiceResult> => {
    try {
        const existingLog = await RequestLog.findOne({ request_id: logData.request_id });
        if (existingLog) {
            return serviceResult(400, "error", "Request log with this ID already exists", null);
        }
        
        const log = RequestLog.create(logData);

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