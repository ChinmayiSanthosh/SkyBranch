import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.registerUser(req.body.email, req.body.password);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await authService.loginUser(req.body.email, req.body.password));
  } catch (err) {
    next(err);
  }
}

export function me(_req: Request, res: Response) {
  res.json({ user: res.locals.user });
}