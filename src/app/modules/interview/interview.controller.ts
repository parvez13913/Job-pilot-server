import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { InterviewService } from "./interview.service";

const createInterview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const payload = req.body;
  const result = await InterviewService.createInterview(userId, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Interview session created successfully!",
    data: result,
  });
});

const getInterviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await InterviewService.getInterviews(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Interview session retrieved successfully!",
    data: result,
  });
});

const getInterviewById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const result = await InterviewService.getInterviewById(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Interview session retrieved successfully!",
    data: result,
  });
});

const updateInterview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const payload = req.body;
  const result = await InterviewService.updateInterview(userId, id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Interview session updated successfully!",
    data: result,
  });
});

const deleteInterview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  await InterviewService.deleteInterview(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Interview session deleted successfully!",
  });
});

export const InterviewController = {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
