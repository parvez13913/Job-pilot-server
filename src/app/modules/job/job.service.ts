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

export const JobService = {
  createJob,
};
