import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";

import { ICreateAnalysisPayload } from "./analysis.interface";

import { analyzeResumeAgainstJob } from "./analysis.utils";

const createAnalysis = async (
  userId: string,
  payload: ICreateAnalysisPayload,
) => {
  const { resumeId, jobId } = payload;

  

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
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Job description has not been parsed yet",
    );
  }


  const analysis = analyzeResumeAgainstJob(
    resume.parsedData as any,
    job.parsedData as any,
  );

  const result = await prisma.jobAnalysis.create({
    data: {
      userId,
      resumeId,
      jobId,

      matchScore: analysis.matchScore,

      matchedSkills: analysis.matchedSkills,

      missingSkills: analysis.missingSkills,

      experienceGaps: analysis.experienceGaps,

      keywords: analysis.keywords,

      recommendations: analysis.recommendations,
    },
  });

  return result;
};

export const AnalysisService = {
  createAnalysis,
};
