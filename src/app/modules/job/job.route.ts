import express from "express";
import auth from "../../middlewares/auth";
import { JobController } from "./job.controller";

const router = express.Router();

router.use(auth);

router.post(
  "/create-job",
  //   validateRequest(createJobSchema),
  JobController.createJob,
);

export const JobRouter = router;
