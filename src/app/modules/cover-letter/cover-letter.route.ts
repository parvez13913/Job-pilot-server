import express from "express";
import auth from "../../middlewares/auth";
import { CoverLetterController } from "./cover-letter.controller";

const router = express.Router();

router.use(auth);

router.post("/create", CoverLetterController.createCoverLetter);
router.get("/", CoverLetterController.getCoverLetters);
router.get("/:id", CoverLetterController.getCoverLetterById);
router.patch("/:id", CoverLetterController.updateCoverLetter);
router.delete("/:id", CoverLetterController.deleteCoverLetter);

export const CoverLetterRouter = router;
