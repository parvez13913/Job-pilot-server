import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import prisma from "../../../lib/prisma";
import { IAuthResponse, ISignUpPayload } from "./auth.interface";

const signUp = async (data: ISignUpPayload): Promise<IAuthResponse> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data?.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "There is already a user by this email.",
    );
  }

  const hashedPassword = await bcrypt.hash(
    data?.password,
    Number(config.bcrypt_salt_round),
  );

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to register.");
  }

  const { email: userEmail, id } = user;

  const accessToken = JwtHelpers.createToken(
    { userEmail, id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as unknown as string,
  );

  const refreshToken = JwtHelpers.createToken(
    { userEmail, id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as unknown as string,
  );

  return { accessToken, refreshToken };
};

export const AuthService = {
  signUp,
};
