import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post(
  "/sign-up",
  //   validateRequest(AuthValidation.signUpZodSchema),
  AuthController.signUp,
);

export const AuthRouter = router;
