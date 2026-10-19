import {NextFunction, Request,Response } from "express";

type Handler = (req: Request, res:Response, next: NextFunction) => Promise<unknown>;


//Passes any error from an async handler to the err middlewaree
export const asyncHandler = 
(fn:Handler) => (req:Request, res:Response, next:NextFunction)=> {
    fn(req,res,next).catch(next);
};