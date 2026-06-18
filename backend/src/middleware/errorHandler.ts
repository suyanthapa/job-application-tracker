import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { errorResponse } from "../utils/response";

// Global error handling middleware

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // AppError
  if (err instanceof AppError) {
    const errors =
      "errors" in err && Array.isArray((err as any).errors)
        ? (err as any).errors
        : undefined;

    return errorResponse(
      res,
      err.message,
      err.statusCode,
      err.code,
      errors,
      err.stack,
    );
  }

  // Prisma errors
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;
    if (prismaError.code === "P2002") {
      return errorResponse(
        res,
        "A record with this value already exists",
        409,
        "DUPLICATE_ENTRY",
        undefined,
        err.stack,
      );
    }
    if (prismaError.code === "P2025") {
      return errorResponse(
        res,
        "Record not found",
        404,
        "NOT_FOUND",
        undefined,
        err.stack,
      );
    }
  }

  // Zod
  if (err.name === "ZodError") {
    return errorResponse(
      res,
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      (err as any).errors,
      err.stack,
    );
  }

  // JWT
  if (err.name === "JsonWebTokenError") {
    return errorResponse(
      res,
      "Invalid token",
      401,
      "INVALID_TOKEN",
      undefined,
      err.stack,
    );
  }

  return errorResponse(
    res,
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again later."
      : err.message,
    500,
    "INTERNAL_SERVER_ERROR",
    undefined,
    err.stack,
  );
};

//Handle 404 - Route not found (incase routes are not defined properly)
export const notFoundHandler = (req: Request, res: Response) => {
  return errorResponse(
    res,
    `Route ${req.method} ${req.url} not found`,
    404,
    "NOT_FOUND",
  );
};
