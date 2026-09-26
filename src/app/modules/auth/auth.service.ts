import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import prisma from "../../../lib/prisma";
import {
  IAuthResponse,
  ISignInPayload,
  ISignUpPayload,
} from "./auth.interface";
import { sendEMail } from "./send-reset-mail";

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

const signIn = async (payload: ISignInPayload): Promise<IAuthResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findFirst({ where: { email } });

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExist?.password);

  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid password");
  }

  const { email: userEmail, id } = isUserExist;

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

  return {
    accessToken,
    refreshToken,
  };
};

const signOut = async (): Promise<void> => {
  return;
};

const forgotPassword = async (payload: { email: string }): Promise<void> => {
  const { email } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  const passwordResetToken = JwtHelpers.createPasswordResetToken(
    { email: isUserExist?.email },
    config.jwt.secret as string,
    "5m",
  );

  const resetLink: string =
    config.reset_password_link + `reset-password?${passwordResetToken}`;

  const username = isUserExist?.email.split("@")[0];

  await sendEMail(
    isUserExist?.email,
    `
      <div>
         <p>Hi, ${username}</p>
         <p>your password reset link: <a href=${resetLink}>Click Here</a></p>
         <p>Thank you</p>
      </div>

    `,
    "Reset you password",
  );
};

export const AuthService = {
  signUp,
  signIn,
  signOut,
  forgotPassword,
};
