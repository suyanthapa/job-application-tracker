import { Router } from "express";
import * as controller from "../controllers/application.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createApplicationSchema,
  updateApplicationSchema,
  getApplicationsSchema,
} from "../utils/validators";

const applicationsRouter = Router();

applicationsRouter.get(
  "/",
  validate(getApplicationsSchema),
  controller.listApplications,
);

applicationsRouter.get("/:id", controller.getApplicationById);

applicationsRouter.post(
  "/",
  validate(createApplicationSchema),
  controller.createApplication,
);

applicationsRouter.patch(
  "/:id",
  validate(updateApplicationSchema),
  controller.updateApplication,
);

applicationsRouter.delete("/:id", controller.deleteApplication);

export default applicationsRouter;
