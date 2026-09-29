import express from "express";
import auth from "../../middlewares/auth";
import { AnalysisController } from "./analysis.controller";

const router = express.Router();

router.use(auth);

router.post("/create-analysis", AnalysisController.createAnalysis);

export const AnalysisRouter = router;
