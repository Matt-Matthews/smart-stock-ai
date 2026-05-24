import type { IServiceResult } from "@typeDefs/request-result.type.js";
import { toCamelCase } from "@utils/object-key.util.js";

/**
 * Provides a standardized service result object.
 *
 * @param {number} statusCode - The HTTP status code.
 * @param {"success" | "error"} status - The result status ("success" or "error").
 * @param {string} message - A descriptive message.
 * @param {any | null} data - Optional result data.
 * @returns {IServiceResult} - The service result object.
 */
export const serviceResult = ( statusCode: number, status: "success" | "error", message: string, data: any | null, error?: any | null ): IServiceResult => {
    return {
        status,
        statusCode: error?.statusCode || statusCode,
        message:error?.message ? `${error.message} ${message}` : message,
        data: data ? toCamelCase(data) : null
    }
}