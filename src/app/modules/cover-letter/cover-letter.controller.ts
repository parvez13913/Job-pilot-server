import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { CoverLetterService } from "./cover-letter.service";

const createCoverLetter = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const payload = req.body;
  const result = await CoverLetterService.createCoverLetter(userId, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cover letter created successfully!",
    data: result,
  });
});

export const CoverLetterController = {
  createCoverLetter,
};
