import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { TailoredResumeService } from "./tailored-resume.service";

const createTailoredResume = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const payload = req.body;
  const result = await TailoredResumeService.createTailoredResume(
    userId,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tailored resume created successfully!",
    data: result,
  });
});

export const TailoredResumeController = {
  createTailoredResume,
};
