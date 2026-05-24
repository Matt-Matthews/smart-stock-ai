type TStatus = "success" | "error"

export interface IServiceResult {
    status: TStatus;
    statusCode: number;
    message: string;
    data?: any | null;
}