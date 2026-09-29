import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";
import {
  ICoverLetterRecord,
  ICreateCoverLetterPayload,
  ICreateCoverLetterResponse,
  IUpdateCoverLetterPayload,
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

const getCoverLetters = async (
  userId: string,
): Promise<ICoverLetterRecord[]> => {
  const coverLetters = await prisma.coverLetter.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return coverLetters as ICoverLetterRecord[];
};

const getCoverLetterById = async (
  userId: string,
  coverLetterId: string,
): Promise<ICoverLetterRecord> => {
  const coverLetter = await prisma.coverLetter.findFirst({
    where: {
      id: coverLetterId,
      userId,
    },
  });

  if (!coverLetter) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Cover letter not found");
  }

  return coverLetter as ICoverLetterRecord;
};

const updateCoverLetter = async (
  userId: string,
  coverLetterId: string,
  payload: Partial<IUpdateCoverLetterPayload>,
): Promise<ICoverLetterRecord> => {
  const existingCoverLetter = await prisma.coverLetter.findFirst({
    where: {
      id: coverLetterId,
      userId,
    },
  });

  if (!existingCoverLetter) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Cover letter not found");
  }

  const updatedCoverLetter = await prisma.coverLetter.update({
    where: {
      id: coverLetterId,
    },
    data: {
      content: payload.content,
    },
  });

  return updatedCoverLetter as ICoverLetterRecord;
};

const deleteCoverLetter = async (
  userId: string,
  coverLetterId: string,
): Promise<void> => {
  const existingCoverLetter = await prisma.coverLetter.findFirst({
    where: {
      id: coverLetterId,
      userId,
    },
  });

  if (!existingCoverLetter) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Cover letter not found");
  }

  await prisma.coverLetter.delete({
    where: {
      id: coverLetterId,
    },
  });
};

export const CoverLetterService = {
  createCoverLetter,
  getCoverLetters,
  getCoverLetterById,
  updateCoverLetter,
  deleteCoverLetter,
};
