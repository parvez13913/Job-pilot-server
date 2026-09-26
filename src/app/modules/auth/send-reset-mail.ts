import nodemailer from "nodemailer";
import config from "../../../config";

export const sendEMail = async (to: string, html: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.email,
      pass: config.app_password,
    },
  });

  await transporter.sendMail({
    from: config.email,
    to,
    subject,
    html,
  });
};
