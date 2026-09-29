import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { ICreateAnalysisPayload } from "./analysis.interface";
import { AnalysisService } from "./analysis.service";

const createAnalysis = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const payload: ICreateAnalysisPayload = req.body;

  const result = await AnalysisService.createAnalysis(userId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Analysis created successfully!",
    data: result,
  });
});

export const AnalysisController = {
  createAnalysis,
};
