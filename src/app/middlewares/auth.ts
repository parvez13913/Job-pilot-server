import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";

import config from "../../config";
import ApiError from "../../errors/ApiError";
import { JwtHelpers } from "../../helpers/jwt-helpers";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Invalid authorization format",
      );
    }

    const token = parts[1];

    const verifiedUser = JwtHelpers.verifiedToken(
      token,
      config.jwt.secret as Secret,
    );

    req.user = verifiedUser as {
      id: string;
      userEmail: string;
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
