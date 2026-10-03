import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApplicationStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { ApplicationService } from "./application.service";

const createApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const payload = req.body;
  const result = await ApplicationService.createApplication(userId, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application created successfully!",
    data: result,
  });
});

const getApplications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const status = req.query.status as ApplicationStatus | undefined;
  const result = await ApplicationService.getApplications(userId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application retrieved successfully!",
    data: result,
  });
});

const getApplicationById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const result = await ApplicationService.getApplicationById(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application retrieved successfully!",
    data: result,
  });
});

const updateApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const payload = req.body;
  const result = await ApplicationService.updateApplication(
    userId,
    id,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application updated successfully!",
    data: result,
  });
});

const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  await ApplicationService.deleteApplication(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application delete successfully!",
  });
});

export const ApplicationController = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
