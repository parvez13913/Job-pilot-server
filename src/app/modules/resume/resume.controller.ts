import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { ResumeService } from "./resume.service";

const createResume = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const data = req.body;
  const file = req.file;

  const result = await ResumeService.createResume(userId, data, file);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Created Successfully!",
    data: result,
  });
});

export const ResumeController = {
  createResume,
};
