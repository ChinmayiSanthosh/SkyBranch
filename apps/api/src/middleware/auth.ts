import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../db";
import { HttpError } from "../utils/errors";

export function requireAuth(req: Request, res: Response, next : NextFunction){
    const header = req.headers.authorization;
    if(!header || !header.startsWith("Bearer ")){
        return next(new HttpError(401, "Authentication required"));
    }
    try {
        const payload = jwt.verify(header.slice(7),env.jwtSecret) as jwt.JwtPayload;
        res.locals.user = { id: Number(payload.sub), email: payload.email};
        next();

    }
    catch {
        next(new HttpError(401,"Invalid or expired token"));
    }
}


// so the initial user can register freely but after that registering requires a login.
export async function registerGuard(req: Request, res: Response, next:NextFunction) {
    try{
        const count = await prisma.user.count();
        if (count ==0) return next();
        return requireAuth(req, res,next);
    }
    catch(err) {
        next(err);
    }
}