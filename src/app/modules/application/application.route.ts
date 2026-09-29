import express from "express";
import auth from "../../middlewares/auth";
import { ApplicationController } from "./application.controller";

const router = express.Router();

router.use(auth);

router.post("/create", ApplicationController.createApplication);
router.get("/", ApplicationController.getApplications);
router.get("/:id", ApplicationController.getApplicationById);
router.patch("/:id", ApplicationController.updateApplication);
router.delete("/:id", ApplicationController.deleteApplication);

export const ApplicationRouter = router;
