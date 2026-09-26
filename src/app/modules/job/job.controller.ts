import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { JobService } from "./job.service";

const createJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const payload = req.body;
  const result = await JobService.createJob(userId, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Job Created Successfully!",
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await JobService.getAllJobs(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Jobs retrieved successfully!",
    data: result,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = req.params.id as string;
  const result = await JobService.getJobById(userId, jobId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Job retrieved successfully!",
    data: result,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = req.params.id as string;
  const payload = req.body;
  const result = await JobService.updateJob(userId, jobId, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Job updated successfully!",
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = req.params.id as string;
  await JobService.deleteJob(userId, jobId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Job deleted successfully!",
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
