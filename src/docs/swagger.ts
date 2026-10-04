import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./openapi.json";

export const setupSwagger = (app: Express): void => {
  app.get("/api-docs/swagger.json", (_req, res) => {
    res.status(200).json(swaggerDocument);
  });

  app.use(
    "/api-docs",
    swaggerUi.serveFiles(swaggerDocument),
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
    }),
  );
};
