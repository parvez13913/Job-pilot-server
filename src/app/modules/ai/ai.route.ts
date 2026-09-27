import express from "express";
import auth from "../../middlewares/auth";
import { AiController } from "./ai.controller";

const router = express.Router();

router.use(auth);

router.post("/resume/:id/parse", AiController.parseResume);
router.post("/job/:id/parse", AiController.parseJob);

export const AiRouter = router;
