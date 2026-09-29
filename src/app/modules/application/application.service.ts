import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";

import { ApplicationStatus } from "../../../generated/prisma/enums";
import {
  IApplicationResponse,
  ICreateApplicationPayload,
  IUpdateApplicationPayload,
} from "./application.interface";

const createApplication = async (
  userId: string,
  payload: ICreateApplicationPayload,
): Promise<IApplicationResponse> => {
  const { jobId, status = ApplicationStatus.SAVED, appliedAt, notes } = payload;
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  }

  const existingApplication = await prisma.application.findFirst({
    where: {
      userId,
      jobId,
    },
  });

  if (existingApplication) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Application already exists for this job",
    );
  }

  const finalAppliedAt =
    status === ApplicationStatus.APPLIED
      ? appliedAt
        ? new Date(appliedAt)
        : new Date()
      : appliedAt
        ? new Date(appliedAt)
        : null;

  const application = await prisma.application.create({
    data: {
      userId,
      jobId,
      status,
      appliedAt: finalAppliedAt,
      notes,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });

  return application;
};

const getApplications = async (
  userId: string,
  status?: ApplicationStatus,
): Promise<IApplicationResponse[]> => {
  const applications = await prisma.application.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
};

const getApplicationById = async (
  userId: string,
  applicationId: string,
): Promise<IApplicationResponse> => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });

  if (!application) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
  }

  return application;
};

const updateApplication = async (
  userId: string,
  applicationId: string,
  payload: Partial<IUpdateApplicationPayload>,
): Promise<IApplicationResponse> => {
  const existingApplication = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!existingApplication) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
  }

  let appliedAt =
    payload.appliedAt !== undefined
      ? payload.appliedAt
        ? new Date(payload.appliedAt)
        : null
      : existingApplication.appliedAt;

  if (payload.status === ApplicationStatus.APPLIED && !appliedAt) {
    appliedAt = new Date();
  }

  const updatedApplication = await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      ...(payload.status !== undefined ? { status: payload.status } : {}),

      ...(payload.notes !== undefined ? { notes: payload.notes } : {}),

      appliedAt,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });

  return updatedApplication;
};

const deleteApplication = async (
  userId: string,
  applicationId: string,
): Promise<void> => {
  const existingApplication = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!existingApplication) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
  }

  await prisma.application.delete({
    where: {
      id: applicationId,
    },
  });
};

export const ApplicationService = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
