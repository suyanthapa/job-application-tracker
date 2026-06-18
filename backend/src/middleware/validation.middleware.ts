import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

// Middleware to validate request body using Zod schemas
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // 1. Pass an object containing all request segments to Zod
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = validated.body;

      next();
    } catch (error: any) {
      if (error.name === "ZodError") {
        const errors = error.errors.map((err: any) => ({
          field:
            err.path.length > 1
              ? err.path.slice(1).join(".")
              : err.path.join("."),
          message: err.message,
        }));

        next(new ValidationError("Validation failed", errors));
      } else {
        next(error);
      }
    }
  };
};
