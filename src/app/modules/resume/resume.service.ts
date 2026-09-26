import prisma from "../../../lib/prisma";
import { ICreateResumePayload, IResumeResponse } from "./resume.interface";

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
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return resumes;
};

export const ResumeService = {
  createResume,
  getUserResumes,
};
