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

router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);

export const JobRouter = router;
