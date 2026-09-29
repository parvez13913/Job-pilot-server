import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../lib/prisma";

import {
  ICreateInterviewPayload,
  IInterviewQuestion,
  IInterviewSessionResponse,
  IUpdateInterviewPayload,
} from "./interview.interface";

import { Prisma } from "../../../generated/prisma/client";
import { normalizeParsedJob } from "../ai/ai.utils";

const createTechnicalQuestions = (skills: string[]): IInterviewQuestion[] => {
  return skills.slice(0, 4).map((skill, index) => ({
    id: `technical-${index + 1}`,
    type: "technical",
    question: `How would you use ${skill} in a real-world project? Please explain your approach and best practices.`,
    topic: skill,
  }));
};

const createResponsibilityQuestions = (
  responsibilities: string[],
): IInterviewQuestion[] => {
  return responsibilities.slice(0, 3).map((responsibility, index) => ({
    id: `responsibility-${index + 1}`,
    type: "situational",
    question: `How would you approach the following responsibility: "${responsibility}"?`,
    topic: "Job Responsibility",
  }));
};

const createBehavioralQuestions = (): IInterviewQuestion[] => {
  return [
    {
      id: "behavioral-1",
      type: "behavioral",
      question:
        "Tell me about a challenging software development problem you faced and how you solved it.",
      topic: "Problem Solving",
    },
    {
      id: "behavioral-2",
      type: "behavioral",
      question:
        "Tell me about a time when you had to learn a new technology or concept quickly.",
      topic: "Learning Ability",
    },
  ];
};

const createGeneralSituationalQuestions = (
  jobTitle: string,
): IInterviewQuestion[] => {
  return [
    {
      id: "situational-1",
      type: "situational",
      question: `If you joined the team as a ${jobTitle} and received a task with unclear requirements, what would you do first?`,
      topic: "Requirement Analysis",
    },
    {
      id: "situational-2",
      type: "situational",
      question:
        "If your implementation worked locally but failed in production, how would you investigate the issue?",
      topic: "Debugging",
    },
  ];
};

const generateInterviewQuestions = (jobData: unknown): IInterviewQuestion[] => {
  const job = normalizeParsedJob(jobData);

  const requiredSkills = job.requiredSkills ?? [];
  const preferredSkills = job.preferredSkills ?? [];
  const responsibilities = job.responsibilities ?? [];

  const allSkills = [...requiredSkills, ...preferredSkills].filter(
    (skill, index, array) =>
      array.findIndex(
        (item) => item.toLowerCase().trim() === skill.toLowerCase().trim(),
      ) === index,
  );

  const technicalQuestions = createTechnicalQuestions(allSkills);

  const responsibilityQuestions =
    createResponsibilityQuestions(responsibilities);

  const behavioralQuestions = createBehavioralQuestions();

  const situationalQuestions = createGeneralSituationalQuestions(
    job.jobTitle || "this position",
  );

  return [
    ...technicalQuestions,
    ...responsibilityQuestions,
    ...behavioralQuestions,
    ...situationalQuestions,
  ].slice(0, 10);
};

const createInterview = async (
  userId: string,
  payload: ICreateInterviewPayload,
): Promise<IInterviewSessionResponse> => {
  const { jobId } = payload;

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  }

  if (!job.parsedData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Job has not been parsed yet");
  }

  const questions = generateInterviewQuestions(job.parsedData);

  if (!questions.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Unable to generate interview questions",
    );
  }

  const interviewSession = await prisma.interviewSession.create({
    data: {
      userId,
      jobId,
      questions: questions as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    id: interviewSession.id,
    userId: interviewSession.userId,
    jobId: interviewSession.jobId,
    questions: interviewSession.questions as unknown as IInterviewQuestion[],
    createdAt: interviewSession.createdAt,
  };
};

const getInterviews = async (
  userId: string,
): Promise<IInterviewSessionResponse[]> => {
  const interviews = await prisma.interviewSession.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return interviews.map((interview) => ({
    id: interview.id,
    userId: interview.userId,
    jobId: interview.jobId,
    questions: interview.questions as unknown as IInterviewQuestion[],
    createdAt: interview.createdAt,
  }));
};

const getInterviewById = async (
  userId: string,
  interviewId: string,
): Promise<IInterviewSessionResponse> => {
  const interview = await prisma.interviewSession.findFirst({
    where: {
      id: interviewId,
      userId,
    },
  });

  if (!interview) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Interview session not found");
  }

  return {
    id: interview.id,
    userId: interview.userId,
    jobId: interview.jobId,
    questions: interview.questions as unknown as IInterviewQuestion[],
    createdAt: interview.createdAt,
  };
};

const updateInterview = async (
  userId: string,
  interviewId: string,
  payload: Partial<IUpdateInterviewPayload>,
): Promise<IInterviewSessionResponse> => {
  const existingInterview = await prisma.interviewSession.findFirst({
    where: {
      id: interviewId,
      userId,
    },
  });

  if (!existingInterview) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Interview session not found");
  }

  const updatedInterview = await prisma.interviewSession.update({
    where: {
      id: interviewId,
    },
    data: {
      questions: payload.questions as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    id: updatedInterview.id,
    userId: updatedInterview.userId,
    jobId: updatedInterview.jobId,
    questions: updatedInterview.questions as unknown as IInterviewQuestion[],
    createdAt: updatedInterview.createdAt,
  };
};

const deleteInterview = async (
  userId: string,
  interviewId: string,
): Promise<void> => {
  const existingInterview = await prisma.interviewSession.findFirst({
    where: {
      id: interviewId,
      userId,
    },
  });

  if (!existingInterview) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Interview session not found");
  }

  await prisma.interviewSession.delete({
    where: {
      id: interviewId,
    },
  });
};

export const InterviewService = {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
