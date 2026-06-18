// Custom Error Classes

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    code?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message, 400, true, "VALIDATION_ERROR");
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, true, "NOT_FOUND");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500, false, "INTERNAL_SERVER_ERROR");
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, false, "DATABASE_ERROR");
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
