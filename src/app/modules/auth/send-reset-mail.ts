import nodemailer from "nodemailer";

import config from "../../../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.email,
    pass: config.app_password,
  },
});

const sendSignupVerificationCode = async (
  email: string,
  name: string | null,
  code: string,
) => {
  await transporter.sendMail({
    from: config.email,
    to: email,
    subject: "Your JobPilot verification code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Verify your JobPilot account</h2>

        <p>
          Hello ${name || "there"},
        </p>

        <p>
          Use the verification code below to complete your signup:
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 24px 0;
          "
        >
          ${code}
        </div>

        <p>
          This code will expire in 10 minutes.
        </p>

        <p>
          If you did not request this code, you can ignore this email.
        </p>
      </div>
    `,
  });
};

const sendPasswordResetCode = async (email: string, code: string) => {
  await transporter.sendMail({
    from: config.email,
    to: email,
    subject: "JobPilot Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Reset your JobPilot password</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Your verification code is:
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 24px 0;
          "
        >
          ${code}
        </div>

        <p>
          This code will expire in 10 minutes.
        </p>

        <p>
          If you did not request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });
};

export const EmailService = {
  sendSignupVerificationCode,
  sendPasswordResetCode,
};
