import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";
import { ICreateJobPayload, IJobResponse } from "./job.interface";

const createJob = async (
  userId: string,
  payload: ICreateJobPayload,
): Promise<IJobResponse> => {
  const result = await prisma.job.create({
    data: {
      userId,
      title: payload.title,
      company: payload.company,
      description: payload.description,
    },
  });
  return result;
};

const getAllJobs = async (userId: string) => {
  const result = await prisma.job.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getJobById = async (userId: string, jobId: string) => {
  const result = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  }

  return result;
};

export const JobService = {
  createJob,
  getAllJobs,
  getJobById,
};
