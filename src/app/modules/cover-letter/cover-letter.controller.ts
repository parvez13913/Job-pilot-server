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

const getCoverLetters = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await CoverLetterService.getCoverLetters(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cover letter retrieved successfully!",
    data: result,
  });
});

const getCoverLetterById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const result = await CoverLetterService.getCoverLetterById(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cover letter retrieved successfully!",
    data: result,
  });
});

const updateCoverLetter = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const payload = req.body;
  const result = await CoverLetterService.updateCoverLetter(
    userId,
    id,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cover letter updated successfully!",
    data: result,
  });
});

const deleteCoverLetter = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  await CoverLetterService.deleteCoverLetter(userId, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cover letter deleted successfully!",
  });
});

export const CoverLetterController = {
  createCoverLetter,
  getCoverLetters,
  getCoverLetterById,
  updateCoverLetter,
  deleteCoverLetter
};
