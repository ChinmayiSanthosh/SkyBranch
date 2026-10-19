import { Request, Response } from "express";
import * as employeeService from "../services/employee.services";
import { HttpError } from "../utils/errors";

function parseId(req:Request): number{
    const id = Number(req.params.id);
    if(!Number.isInteger(id) || id<=0) throw new HttpError(400,"Invalid employee id ");
    return id;
}

export async function list(req:Request, res:Response){
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    res.json({ employees:await employeeService.listEmployees(search)});
}

export async function hierarchy(_req:Request, res:Response){
    res.json({roots:await employeeService.getHierarchy()});
}

export async function getOne(req: Request, res: Response) {
  res.json({employee: await employeeService.getEmployee(parseId(req))});
}

export async function create(req: Request, res: Response) {
  res.status(201).json({employee:await employeeService.createEmployee(req.body)});
}

export async function update(req: Request, res: Response){
    res.json({employee:await employeeService.updateEmployee(parseId(req), req.body)});
}

export async function remove(req: Request, res: Response){
    await employeeService.deleteEmployee(parseId(req));
    res.status(204).send();
}