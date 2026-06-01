type TStatus = "success" | "error"

export interface IServiceResult<T = any> {
    status: TStatus;
    statusCode: number;
    message: string;
    data?: T | null;
}