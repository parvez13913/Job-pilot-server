import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import router from "./app/routes";

const app: Application = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "JobPilot Backend Server is running!",
  });
});

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "JobPilot API is running",
  });
});

app.use("/api/v1", router);

// 404 handler MUST be last
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

export default app;
