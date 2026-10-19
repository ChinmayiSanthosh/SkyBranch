import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errors";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  } 

  //unique constraint fail like a duplicate email or employee num shows up..
  const prismaError = err as {code? : string; meta?: {target?: unknown}};
  if(prismaError?.code === "P2002") {
    res.status(409).json({
        error:"A record with this value already exists",
        details: prismaError.meta?.target,
    });
    return;
  }

  console.error(err);
  res.status(500).json({error:"Internal server error :("})
}