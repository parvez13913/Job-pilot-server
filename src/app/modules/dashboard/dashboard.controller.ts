import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";

import { DashboardService } from "./dashboard.service";

const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await DashboardService.getDashboard(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard data retrieved successfully!",
    data: result,
  });
});

export const DashboardController = {
  getDashboard,
};
