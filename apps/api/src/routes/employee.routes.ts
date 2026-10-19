import { Router } from "express";
import * as controller from "../controllers/employee.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { employeeSchema, updateEmployeeSchema } from "../validators/employee.validator";


const router = Router();

router.use(requireAuth);

//hierarchy must be before id or itll literally be read as id
router.get("/hierarchy",asyncHandler(controller.hierarchy));
router.get("/",asyncHandler(controller.list));
router.get("/:id",asyncHandler(controller.getOne)); 
router.post("/",validate(employeeSchema), asyncHandler(controller.create));
router.patch("/:id",validate(updateEmployeeSchema),asyncHandler(controller.update));
router.delete("/:id",asyncHandler(controller.remove));

export default router;