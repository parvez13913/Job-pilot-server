import crypto from "crypto";

export const generateSignupCode = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashSignupCode = (code: string): string => {
  return crypto.createHash("sha256").update(code).digest("hex");
};
