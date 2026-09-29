import express from "express";
import auth from "../../middlewares/auth";
import { TailoredResumeController } from "./tailored-resume.controller";

const router = express.Router();

router.use(auth);

router.post("/create", TailoredResumeController.createTailoredResume);

export const TailoredResumeRouter = router;
