import axiosInstance from "./axios";
import type {
  ApiResponse,
  Application,
  ApplicationQueryParams,
  ApplicationsResponse,
} from "@/types";
import type { CreateApplicationInput, UpdateApplicationInput } from "./schemas";
import { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse<never> | undefined;
    throw new ApiError(
      data?.message || "Something went wrong.",
      error.response?.status ?? 500,
      data?.error?.errors,
    );
  }
  throw new ApiError("Network error. Please check your connection.", 0);
}

export const api = {
  listApplications: async (
    params: ApplicationQueryParams = {},
  ): Promise<ApplicationsResponse> => {
    try {
      const res = await axiosInstance.get<ApiResponse<ApplicationsResponse>>(
        "/applications",
        { params },
      );
      return res.data.data!;
    } catch (e) {
      handleError(e);
    }
  },

  getApplication: async (id: string): Promise<Application> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Application>>(
        `/applications/${id}`,
      );
      return res.data.data!;
    } catch (e) {
      handleError(e);
    }
  },

  createApplication: async (
    payload: CreateApplicationInput,
  ): Promise<Application> => {
    try {
      const res = await axiosInstance.post<ApiResponse<Application>>(
        "/applications",
        payload,
      );
      return res.data.data!;
    } catch (e) {
      handleError(e);
    }
  },

  updateApplication: async (
    id: string,
    payload: UpdateApplicationInput,
  ): Promise<Application> => {
    try {
      const res = await axiosInstance.patch<ApiResponse<Application>>(
        `/applications/${id}`,
        payload,
      );
      return res.data.data!;
    } catch (e) {
      handleError(e);
    }
  },

  deleteApplication: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/applications/${id}`);
    } catch (e) {
      handleError(e);
    }
  },
};
