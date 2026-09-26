import express from "express";
import auth from "../../middlewares/auth";
import { ResumeController } from "./resume.controller";
import { uploadResume } from "./resume.middleware";

const router = express.Router();

router.use(auth);

router.post(
  "/create-resume",
  //   validateRequest(createResumeSchema),
  uploadResume.single("resume"),
  ResumeController.createResume,
);

router.get("/", ResumeController.getUserResumes);
router.get("/:id", ResumeController.getResumeById);
export const ResumeRouter = router;
