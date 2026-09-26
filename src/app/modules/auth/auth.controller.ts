import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { AuthService } from "./auth.service";

const signUp = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const result = await AuthService.signUp(data);

  const cookieOptions = {
    secure: config.env === "development",
    httpOnly: true,
  };

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Created Successfully!",
    token: accessToken,
  });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
  const { ...signInData } = req.body;

  const result = await AuthService.signIn(signInData);

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User login successfully!",
    token: accessToken,
  });
});

const signOut = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged out successfully!",
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset link sent to your email!",
  });
});

export const AuthController = {
  signUp,
  signIn,
  signOut,
  forgotPassword,
};
