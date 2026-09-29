import express from "express";
import auth from "../../middlewares/auth";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.use(auth);

router.get("/", DashboardController.getDashboard);

export const DashboardRouter = router;
