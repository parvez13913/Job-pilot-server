import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "JobPilot API",
      version: "1.0.0",
      description:
        "JobPilot is an AI-powered job application assistant API for resume analysis, tailored resumes, cover letters, interview preparation, application tracking, and dashboard analytics.",
      contact: {
        name: "Parvez Rahman",
      },
    },

    servers: [
      {
        url:
          process.env.API_BASE_URL ||
          "https://job-pilot-server-lovat.vercel.app/api-docs/api/v1",
        description:
          process.env.NODE_ENV === "production"
            ? "Production"
            : "Development",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication and account management",
      },
      {
        name: "Resume",
        description: "Resume management and PDF parsing",
      },
      {
        name: "Job",
        description: "Job description management and parsing",
      },
      {
        name: "AI",
        description: "Resume and job parsing operations",
      },
      {
        name: "Analysis",
        description: "Resume vs job analysis",
      },
      {
        name: "Tailored Resume",
        description: "Job-specific resume generation",
      },
      {
        name: "Cover Letter",
        description: "Cover letter generation and management",
      },
      {
        name: "Interview",
        description: "Interview preparation",
      },
      {
        name: "Application",
        description: "Application tracking",
      },
      {
        name: "Dashboard",
        description: "Dashboard and analytics",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT access token.",
        },

        refreshToken: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },

      responses: {
        Unauthorized: {
          description: "Authentication required or token is invalid",
        },
        Forbidden: {
          description: "You do not have permission to perform this action",
        },
        NotFound: {
          description: "Resource not found",
        },
        BadRequest: {
          description: "Invalid request data",
        },
        Conflict: {
          description: "Resource already exists",
        },
      },
    },
  },

  apis: [
    path.join(
      process.cwd(),
      "src/app/modules/**/*.route.ts",
    ),
    path.join(
      process.cwd(),
      "src/app/routes/**/*.ts",
    ),
  ],

  failOnErrors: true,
};

const swaggerSpec =
  swaggerJSDoc(swaggerOptions);

export const setupSwagger = (
  app: Express,
): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "JobPilot API Documentation",
    }),
  );

  app.get("/api-docs.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
  });
};