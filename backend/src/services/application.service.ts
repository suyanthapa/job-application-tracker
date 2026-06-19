import { AppError, NotFoundError } from "../utils/errors";
import {
  Application,
  CreateApplicationDto,
  UpdateApplicationDto,
  ListApplicationsQuery,
  PaginatedResponse,
} from "../types";
import prisma from "../config/prisma";

export const listApplications = async (
  query: ListApplicationsQuery,
): Promise<PaginatedResponse<Application>> => {
  const { status, search } = query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build dynamic where clause
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { company_name: { contains: search, mode: "insensitive" } },
      { job_title: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return {
    items: items as Application[],
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getApplicationById = async (id: string): Promise<Application> => {
  const application = await prisma.application.findUnique({
    where: { id },
  });
  if (!application) {
    throw new NotFoundError(`Application with id '${id}' not found.`);
  }
  return application as Application;
};

export const createApplication = async (
  createData: CreateApplicationDto,
): Promise<Application> => {
  const application = await prisma.application.create({
    data: createData,
  });
  return application as Application;
};

export const updateApplication = async (
  id: string,
  updateData: UpdateApplicationDto,
): Promise<Application> => {
  await getApplicationById(id); // throws 404 if not found (notfound error)

  const application = await prisma.application.update({
    where: { id },
    data: updateData,
  });
  return application as Application;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await getApplicationById(id); // throws 404 if not found
  await prisma.application.delete({ where: { id } });
};
