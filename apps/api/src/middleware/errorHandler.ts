import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errors";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
  } else {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}