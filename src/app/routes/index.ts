import express from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { JobRouter } from "../modules/job/job.route";
import { ResumeRouter } from "../modules/resume/resume.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
