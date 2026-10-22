import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../db";
import { HttpError } from "../utils/errors";

// Checks the token, then loads the user fresh from the database,
// so a deleted account or a changed role takes effect immediately
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authentication required"));
  }

  let userId: number;
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as jwt.JwtPayload;
    userId = Number(payload.sub);
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
  if (!Number.isInteger(userId)) return next(new HttpError(401, "Invalid or expired token"));

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, employeeId: true, mustChangePassword: true },
    });
    if (!user) return next(new HttpError(401, "Invalid or expired token"));
    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireAdmin(_req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.role !== "ADMIN") {
    return next(new HttpError(403, "Only administrators can do this"));
  }
  next();
}

// An account with a temporary password must set its own before using the data
export function requireReadyAccount(_req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.mustChangePassword) {
    return next(new HttpError(403, "You must set a new password before continuing"));
  }
  next();
}

// The very first user may register freely; after that, only an administrator can
export async function registerGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await prisma.user.count();
    if (count === 0) return next();
    requireAuth(req, res, (err?: unknown) => {
      if (err) return next(err);
      requireAdmin(req, res, next);
    });
  } catch (err) {
    next(err);
  }
}