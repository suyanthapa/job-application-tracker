export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly code?: string;
    constructor(message: string, statusCode: number, isOperational?: boolean, code?: string);
}
export declare class ValidationError extends AppError {
    readonly errors: any[];
    constructor(message: string, errors?: any[]);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string);
}
export declare class DatabaseError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map