import express from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { ResumeRouter } from "../modules/resume/resume.route.js";
import { JobRouter } from "../modules/job/job.route.js";
import { AiRouter } from "../modules/ai/ai.route.js";
import { AnalysisRouter } from "../modules/analysis/analysis.route.js";
import { TailoredResumeRouter } from "../modules/tailored-resume/tailored-resume.route.js";
import { CoverLetterRouter } from "../modules/cover-letter/cover-letter.route.js";
import { InterviewRouter } from "../modules/interview/interview.route.js";
import { ApplicationRouter } from "../modules/application/application.route.js";
import { DashboardRouter } from "../modules/dashboard/dashboard.route.js";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/resume",
    route: ResumeRouter,
  },
  {
    path: "/job",
    route: JobRouter,
  },
  {
    path: "/ai",
    route: AiRouter,
  },
  {
    path: "/analysis",
    route: AnalysisRouter,
  },
  {
    path: "/tailored-resume",
    route: TailoredResumeRouter,
  },
  {
    path: "/cover-letter",
    route: CoverLetterRouter,
  },
  {
    path: "/interview",
    route: InterviewRouter,
  },
  {
    path: "/application",
    route: ApplicationRouter,
  },
  {
    path: "/dashboard",
    route: DashboardRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
