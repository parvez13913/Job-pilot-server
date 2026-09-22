import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { AnyZodObject, ZodEffects } from "zod/v3";

const validateRequest =
  (schema: ZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
