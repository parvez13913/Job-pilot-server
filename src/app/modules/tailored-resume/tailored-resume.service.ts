import { StatusCodes } from "http-status-codes";

import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";

import { ICreateTailoredResumePayload } from "./tailored-resume.interface";
import { createTailoredResumeHelper } from "./tailored-resume.utils";

const createTailoredResume = async (
  userId: string,
  payload: ICreateTailoredResumePayload,
) => {
  const { resumeId, jobId, analysisId } = payload;

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

  const analysis = await prisma.jobAnalysis.findFirst({
    where: {
      id: analysisId,
      userId,
      resumeId,
      jobId,
    },
  });

  if (!analysis) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Analysis not found");
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

  const tailoredResume = createTailoredResumeHelper(
    resume.parsedData as any,
    job.parsedData as any,
    {
      matchScore: analysis.matchScore,

      matchedSkills: analysis.matchedSkills,

      missingSkills: analysis.missingSkills,

      experienceGaps: analysis.experienceGaps,

      keywords: analysis.keywords,

      recommendations: analysis.recommendations,
    },
  );

  const resumeVersion = await prisma.resumeVersion.create({
    data: {
      resumeId,
      jobId,
      content: tailoredResume,
    },
  });

  return {
    version: resumeVersion,
    content: tailoredResume,
    source: "local" as const,
  };
};

export const TailoredResumeService = {
  createTailoredResume,
};
