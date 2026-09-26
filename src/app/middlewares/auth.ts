import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";

import config from "../../config";
import ApiError from "../../errors/ApiError";
import { JwtHelpers } from "../../helpers/jwt-helpers";
import { StatusCodes } from "http-status-codes";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
    // verify token
    let verifiedUser = null;
    verifiedUser = JwtHelpers.verifiedToken(token, config.jwt.secret as Secret);
    req.user = verifiedUser;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
