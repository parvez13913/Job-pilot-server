import express from "express";
import auth from "../../middlewares/auth";
import { AnalysisController } from "./analysis.controller";

const router = express.Router();

router.use(auth);

router.post("/create-analysis", AnalysisController.createAnalysis);
router.get("/:id", AnalysisController.getAnalysisById);
router.get("/", AnalysisController.getUserAnalyses);

export const AnalysisRouter = router;
