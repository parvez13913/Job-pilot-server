import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";
import {
  ICreateResumePayload,
  IResumeResponse,
  IUpdateResumePayload,
} from "./resume.interface";

import { extractPdfText } from "./resume.utils";

const createResume = async (
  userId: string,
  payload: ICreateResumePayload,
  file?: Express.Multer.File,
): Promise<IResumeResponse> => {
  if (!file) {
    throw new Error("Resume PDF is required");
  }

  const rawText = await extractPdfText(file.path);

  if (!rawText) {
    throw new Error("Could not extract text from the PDF");
  }
  const resume = await prisma.resume.create({
    data: {
      userId,
      name: payload.name,
      fileUrl: `/uploads/resumes/${file.filename}`,
      rawText,
    },
  });

  return resume;
};

const getUserResumes = async (userId: string): Promise<IResumeResponse[]> => {
  const result = await prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getResumeById = async (
  userId: string,
  resumeId: string,
): Promise<IResumeResponse | null> => {
  const result = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Resume not found");
  }

  return result;
};

const updateResume = async (
  userId: string,
  resumeId: string,
  payload: IUpdateResumePayload,
): Promise<IResumeResponse> => {
  const existingResume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!existingResume) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Resume not found");
  }

  const result = await prisma.resume.update({
    where: {
      id: resumeId,
      userId,
    },

    data: {
      ...(payload.name !== undefined && {
        name: payload.name,
      }),
    },
  });

  return result;
};

export const ResumeService = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
};
