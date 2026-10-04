import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerSpec = {
  openapi: "3.0.3",

  info: {
    title: "JobPilot API",
    version: "1.0.0",
    description: "JobPilot - AI Job Application Assistant API",
    contact: {
      name: "Parvez Rahman",
    },
  },

  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:5000/api/v1",
      description: "API Server",
    },
  ],

  tags: [
    {
      name: "Auth",
      description: "Authentication APIs",
    },
    {
      name: "Resume",
      description: "Resume management APIs",
    },
    {
      name: "Job",
      description: "Job management APIs",
    },
    {
      name: "AI",
      description: "AI parsing APIs",
    },
    {
      name: "Analysis",
      description: "Resume and job analysis APIs",
    },
    {
      name: "Tailored Resume",
      description: "Tailored resume APIs",
    },
    {
      name: "Cover Letter",
      description: "Cover letter APIs",
    },
    {
      name: "Interview",
      description: "Interview preparation APIs",
    },
    {
      name: "Application",
      description: "Job application tracking APIs",
    },
    {
      name: "Dashboard",
      description: "Dashboard and analytics APIs",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  paths: {
    "/health": {
      get: {
        tags: ["Auth"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is running",
          },
        },
      },
    },

    "/auth/sign-up": {
      post: {
        tags: ["Auth"],
        summary: "Create a new account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  name: {
                    type: "string",
                    example: "Parvez Rahman",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "parvez@example.com",
                  },
                  password: {
                    type: "string",
                    example: "Password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Verification code sent successfully",
          },
          "409": {
            description: "User already exists",
          },
        },
      },
    },

    "/auth/verify-signup": {
      post: {
        tags: ["Auth"],
        summary: "Verify signup using OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "code"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "parvez@example.com",
                  },
                  code: {
                    type: "string",
                    example: "234556",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Account verified successfully",
          },
          "400": {
            description: "Invalid or expired verification code",
          },
        },
      },
    },

    "/auth/sign-in": {
      post: {
        tags: ["Auth"],
        summary: "Sign in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                    format: "password",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
          },
          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },

    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Send password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "parvez@example.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset code sent",
          },
        },
      },
    },

    "/auth/verify-password-reset": {
      post: {
        tags: ["Auth"],
        summary: "Verify password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "code"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  code: {
                    type: "string",
                    example: "234556",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Reset code verified",
          },
        },
      },
    },

    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["resetToken", "newPassword"],
                properties: {
                  resetToken: {
                    type: "string",
                  },
                  newPassword: {
                    type: "string",
                    example: "NewPassword123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset successfully",
          },
        },
      },
    },

    "/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard data",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Dashboard retrieved successfully",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },

    "/applications": {
      get: {
        tags: ["Application"],
        summary: "Get applications",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Applications retrieved successfully",
          },
        },
      },

      post: {
        tags: ["Application"],
        summary: "Create application",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Application created successfully",
          },
        },
      },
    },

    "/jobs": {
      get: {
        tags: ["Job"],
        summary: "Get jobs",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Jobs retrieved successfully",
          },
        },
      },

      post: {
        tags: ["Job"],
        summary: "Create job",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Job created successfully",
          },
        },
      },
    },

    "/resumes": {
      get: {
        tags: ["Resume"],
        summary: "Get resumes",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Resumes retrieved successfully",
          },
        },
      },

      post: {
        tags: ["Resume"],
        summary: "Upload/create resume",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Resume created successfully",
          },
        },
      },
    },

    "/cover-letters": {
      get: {
        tags: ["Cover Letter"],
        summary: "Get cover letters",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Cover letters retrieved successfully",
          },
        },
      },

      post: {
        tags: ["Cover Letter"],
        summary: "Generate cover letter",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Cover letter created successfully",
          },
        },
      },
    },

    "/interviews": {
      get: {
        tags: ["Interview"],
        summary: "Get interview sessions",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Interview sessions retrieved successfully",
          },
        },
      },

      post: {
        tags: ["Interview"],
        summary: "Create interview session",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Interview session created successfully",
          },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    }),
  );

  app.get("/api-docs.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
  });
};
