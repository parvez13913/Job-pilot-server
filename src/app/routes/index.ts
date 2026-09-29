import express from "express";
import { AiRouter } from "../modules/ai/ai.route";
import { AnalysisRouter } from "../modules/analysis/analysis.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { CoverLetterRouter } from "../modules/cover-letter/cover-letter.route";
import { InterviewRouter } from "../modules/interview/interview.route";
import { JobRouter } from "../modules/job/job.route";
import { ResumeRouter } from "../modules/resume/resume.route";
import { TailoredResumeRouter } from "../modules/tailored-resume/tailored-resume.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
