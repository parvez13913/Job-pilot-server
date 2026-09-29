import express from "express";
import auth from "../../middlewares/auth";
import { CoverLetterController } from "./cover-letter.controller";

const router = express.Router();

router.use(auth);

router.post("/create", CoverLetterController.createCoverLetter);

export const CoverLetterRouter = router;
