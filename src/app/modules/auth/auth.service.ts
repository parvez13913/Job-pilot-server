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
import {
  generateOtpCode,
  generateSignupCode,
  hashOtpCode,
  hashSignupCode,
} from "./auth.utils";
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

const forgotPassword = async (payload: {
  email: string;
}): Promise<{ message: string }> => {
  const email = payload.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  await prisma.passwordReset.deleteMany({
    where: {
      email,
    },
  });

  const code = generateOtpCode();

  const codeHash = hashOtpCode(code);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      email: user.email,
      codeHash,
      expiresAt,
    },
  });

  try {
    await EmailService.sendPasswordResetCode(user.email, code);
  } catch (error) {
    await prisma.passwordReset.deleteMany({
      where: {
        email,
      },
    });

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send password reset code.",
    );
  }

  return {
    message: "Password reset code has been sent to your email.",
  };
};

const verifyPasswordResetCode = async (payload: {
  email: string;
  code: string;
}): Promise<{ resetToken: string }> => {
  const email = payload.email.toLowerCase().trim();

  const resetRequest = await prisma.passwordReset.findFirst({
    where: {
      email,
      usedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!resetRequest) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Password reset request not found.",
    );
  }

  if (resetRequest.expiresAt < new Date()) {
    await prisma.passwordReset.delete({
      where: {
        id: resetRequest.id,
      },
    });

    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Verification code has expired.",
    );
  }

  if (resetRequest.attempts >= 5) {
    throw new ApiError(
      StatusCodes.TOO_MANY_REQUESTS,
      "Too many incorrect attempts. Please request a new code.",
    );
  }

  const codeHash = hashOtpCode(payload.code);

  if (codeHash !== resetRequest.codeHash) {
    await prisma.passwordReset.update({
      where: {
        id: resetRequest.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid verification code.");
  }

  await prisma.passwordReset.update({
    where: {
      id: resetRequest.id,
    },
    data: {
      verifiedAt: new Date(),
    },
  });

  const resetToken = JwtHelpers.createPasswordResetToken(
    {
      userId: resetRequest.userId,
      resetId: resetRequest.id,
      purpose: "PASSWORD_RESET",
    },
    config.jwt.secret as string,
    "10m",
  );

  return {
    resetToken,
  };
};

const resetPassword = async (payload: {
  resetToken: string;
  newPassword: string;
}): Promise<void> => {
  const decoded = JwtHelpers.verifiedToken(
    payload.resetToken,
    config.jwt.secret as Secret,
  );

  if (decoded?.purpose !== "PASSWORD_RESET") {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Invalid password reset token.",
    );
  }

  const resetId = decoded.resetId;
  const userId = decoded.userId;

  if (!resetId || !userId) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Invalid password reset token.",
    );
  }

  const resetRequest = await prisma.passwordReset.findFirst({
    where: {
      id: resetId,
      userId,
    },
  });

  if (!resetRequest) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Password reset request not found.",
    );
  }

  if (!resetRequest.verifiedAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Please verify the reset code first.",
    );
  }

  if (resetRequest.usedAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "This password reset request has already been used.",
    );
  }

  if (resetRequest.expiresAt < new Date()) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password reset request has expired.",
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordReset.update({
    where: {
      id: resetRequest.id,
    },
    data: {
      usedAt: new Date(),
    },
  });
};

export const AuthService = {
  signUp,
  verifySignUp,
  signIn,
  signOut,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
};
