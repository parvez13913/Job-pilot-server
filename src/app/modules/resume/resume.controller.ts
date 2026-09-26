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

const getUserResumes = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const resumes = await ResumeService.getUserResumes(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Resumes retrieved successfully!",
    data: resumes,
  });
});

const getResumeById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params as { id: string };

  const result = await ResumeService.getResumeById(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Resume retrieved successfully!",
    data: result,
  });
});

const updateResume = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params as { id: string };
  const payload = req.body;

  const result = await ResumeService.updateResume(userId, id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Resume updated successfully!",
    data: result,
  });
});

const deleteResume = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params as { id: string };

  await ResumeService.deleteResume(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Resume deleted successfully!",
  });
});

export const ResumeController = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
};
