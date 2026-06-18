import { Request, Response, NextFunction } from "express";
import * as applicationService from "../services/application.service";
import { successResponse } from "../utils/response";
import {
  CreateApplicationDto,
  UpdateApplicationDto,
  ListApplicationsQuery,
} from "../types";
import { asyncHandler } from "../utils/asyncHandler";

export const listApplications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as ListApplicationsQuery;
      const result = await applicationService.listApplications(query);
      successResponse(res, result, "Applications retrieved successfully.");
    } catch (err) {
      next(err);
    }
  },
);

export const getApplicationById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicationId = req.params.id as string;
      const application =
        await applicationService.getApplicationById(applicationId);
      successResponse(res, application, "Application retrieved successfully.");
    } catch (err) {
      next(err);
    }
  },
);

export const createApplication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateApplicationDto;
      const application = await applicationService.createApplication(dto);
      successResponse(
        res,
        application,
        "Application created successfully.",
        201,
      );
    } catch (err) {
      next(err);
    }
  },
);

export const updateApplication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicationId = req.params.id as string;
      const dto = req.body as UpdateApplicationDto;
      const application = await applicationService.updateApplication(
        applicationId,
        dto,
      );
      successResponse(res, application, "Application updated successfully.");
    } catch (err) {
      next(err);
    }
  },
);

export const deleteApplication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicationId = req.params.id as string;
      await applicationService.deleteApplication(applicationId);
      successResponse(res, null, "Application deleted successfully.", 204);
    } catch (err) {
      next(err);
    }
  },
);
