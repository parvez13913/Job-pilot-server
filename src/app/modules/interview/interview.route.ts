import express from "express";
import auth from "../../middlewares/auth";
import { InterviewController } from "./interview.controller";

const router = express.Router();

router.use(auth);

router.post("/create", InterviewController.createInterview);

export const InterviewRouter = router;
