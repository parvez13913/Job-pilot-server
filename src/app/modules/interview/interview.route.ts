import express from "express";
import auth from "../../middlewares/auth";
import { InterviewController } from "./interview.controller";

const router = express.Router();

router.use(auth);

router.post("/create", InterviewController.createInterview);
router.get("/", InterviewController.getInterviews);
router.get("/:id", InterviewController.getInterviewById);
router.patch("/:id", InterviewController.updateInterview);
router.delete("/:id", InterviewController.deleteInterview);

export const InterviewRouter = router;
