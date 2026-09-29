import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";
import {
  ICoverLetterRecord,
  ICreateCoverLetterPayload,
  ICreateCoverLetterResponse,
} from "./cover-letter.interface";
import { createCoverLetterHelper } from "./cover-letter.utils";

const createCoverLetter = async (
  userId: string,
  payload: ICreateCoverLetterPayload,
): Promise<ICreateCoverLetterResponse> => {
  const { resumeId, jobId, tone = "professional", length = "medium" } = payload;

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Resume not found");
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  }

  if (!resume.parsedData) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Resume has not been parsed yet",
    );
  }

  if (!job.parsedData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Job has not been parsed yet");
  }

  const content = createCoverLetterHelper(resume.parsedData, job.parsedData, {
    tone,
    length,
  });

  const coverLetter = await prisma.coverLetter.create({
    data: {
      userId,
      resumeId,
      jobId,
      content,
    },
  });

  return {
    coverLetter: coverLetter as ICoverLetterRecord,
    source: "local",
  };
};

export const CoverLetterService = {
  createCoverLetter,
};
