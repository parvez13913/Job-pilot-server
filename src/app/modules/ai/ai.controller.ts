import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { AiService } from "./ai.service";

const parseResume = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user?.id;

  const result = await AiService.parseResume(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Resume parsed successfully!",
    data: result,
  });
});

const parseJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user?.id;

  const result = await AiService.parseJob(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Job parsed successfully!",
    data: result,
  });
});

export const AiController = {
  parseResume,
  parseJob,
};
