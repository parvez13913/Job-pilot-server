import prisma from "../../../lib/prisma";

import { IApplicationStats, IDashboardResponse } from "./dashboard.interface";

const getDashboard = async (userId: string): Promise<IDashboardResponse> => {
  const [
    totalResumes,
    totalJobs,
    totalApplications,
    totalCoverLetters,
    totalInterviews,
    totalAnalyses,
    applicationGroups,
    averageMatchScoreResult,
  ] = await Promise.all([
    prisma.resume.count({
      where: {
        userId,
      },
    }),

    prisma.job.count({
      where: {
        userId,
      },
    }),

    prisma.application.count({
      where: {
        userId,
      },
    }),

    prisma.coverLetter.count({
      where: {
        userId,
      },
    }),

    prisma.interviewSession.count({
      where: {
        userId,
      },
    }),

    prisma.jobAnalysis.count({
      where: {
        userId,
      },
    }),

    prisma.application.groupBy({
      by: ["status"],
      where: {
        userId,
      },
      _count: {
        status: true,
      },
    }),

    prisma.jobAnalysis.aggregate({
      where: {
        userId,
      },
      _avg: {
        matchScore: true,
      },
    }),
  ]);

  const applicationStats: IApplicationStats = {
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };

  applicationGroups.forEach((item) => {
    const count = item._count.status;

    switch (item.status) {
      case "SAVED":
        applicationStats.saved = count;
        break;

      case "APPLIED":
        applicationStats.applied = count;
        break;

      case "INTERVIEW":
        applicationStats.interview = count;
        break;

      case "OFFER":
        applicationStats.offer = count;
        break;

      case "REJECTED":
        applicationStats.rejected = count;
        break;

      case "WITHDRAWN":
        applicationStats.withdrawn = count;
        break;
    }
  });

  return {
    totalResumes,
    totalJobs,
    totalApplications,
    totalCoverLetters,
    totalInterviews,
    totalAnalyses,
    averageMatchScore: Number(
      (averageMatchScoreResult._avg.matchScore ?? 0).toFixed(2),
    ),
    applicationStats,
  };
};

export const DashboardService = {
  getDashboard,
};
