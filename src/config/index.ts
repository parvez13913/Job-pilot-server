import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  database_url: process.env.DATABASE_URL || "",
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  reset_password_link: process.env.RESET_PASSWORD_LINK,
  email: process.env.EMAIL,
  app_password: process.env.APP_PASSWORD,
  send_admin_email: process.env.SEND_ADMIN_EMAIL,
};
