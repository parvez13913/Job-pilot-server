import express from "express";
import validateRequest from "../../middlewares/validate-request";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/sign-up",
  validateRequest(AuthValidation.signUpZodSchema),
  AuthController.signUp,
);

router.post("/sign-in", AuthController.signIn);

export const AuthRouter = router;
