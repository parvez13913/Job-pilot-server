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
import { generateSignupCode, hashSignupCode } from "./auth.utils";
import { EmailService } from "./send-reset-mail";

const signUp = async (data: ISignUpPayload): Promise<{ message: string }> => {
  const email = data.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "There is already a user by this email.",
    );
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_round),
  );

  const code = generateSignupCode();

  const codeHash = hashSignupCode(code);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.pendingSignup.deleteMany({
    where: {
      email,
    },
  });

  await prisma.pendingSignup.create({
    data: {
      name: data.name,
      email,
      passwordHash: hashedPassword,
      codeHash,
      expiresAt,
    },
  });

  try {
    await EmailService.sendSignupVerificationCode(
      email,
      data.name ?? null,
      code,
    );
  } catch (error) {
    await prisma.pendingSignup.deleteMany({
      where: {
        email,
      },
    });

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send verification code.",
    );
  }

  return {
    message: "Verification code sent to your email.",
  };
};

const verifySignUp = async (
  email: string,
  code: string,
): Promise<IAuthResponse> => {
  const normalizedEmail = email.toLowerCase().trim();

  const pendingSignup = await prisma.pendingSignup.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!pendingSignup) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Signup request not found or already verified.",
    );
  }

  if (pendingSignup.expiresAt < new Date()) {
    await prisma.pendingSignup.delete({
      where: {
        id: pendingSignup.id,
      },
    });

    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Verification code has expired. Please sign up again.",
    );
  }

  if (pendingSignup.attempts >= 5) {
    await prisma.pendingSignup.delete({
      where: {
        id: pendingSignup.id,
      },
    });

    throw new ApiError(
      StatusCodes.TOO_MANY_REQUESTS,
      "Too many incorrect attempts. Please sign up again.",
    );
  }

  const hashedCode = hashSignupCode(code);

  if (hashedCode !== pendingSignup.codeHash) {
    await prisma.pendingSignup.update({
      where: {
        id: pendingSignup.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid verification code.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    await prisma.pendingSignup.delete({
      where: {
        id: pendingSignup.id,
      },
    });

    throw new ApiError(
      StatusCodes.CONFLICT,
      "There is already a user by this email.",
    );
  }

  const user = await prisma.user.create({
    data: {
      name: pendingSignup.name,
      email: pendingSignup.email,
      password: pendingSignup.passwordHash,
    },
  });

  await prisma.pendingSignup.delete({
    where: {
      id: pendingSignup.id,
    },
  });

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

  return {
    accessToken,
    refreshToken,
  };
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
};

export const AuthService = {
  signUp,
  verifySignUp,
  signIn,
  signOut,
  forgotPassword,
};
