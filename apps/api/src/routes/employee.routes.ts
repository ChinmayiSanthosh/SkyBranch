import { Router } from "express";
import * as controller from "../controllers/employee.controller";
import { requireAdmin, requireAuth, requireReadyAccount } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { employeeSchema, updateEmployeeSchema } from "../validators/employee.validator";

const router = Router();

router.use(requireAuth, requireReadyAccount);

// Anyone signed in may read (employees get no salaries)
// "/hierarchy" must come before "/:id", or "hierarchy" would be read as an id
router.get("/hierarchy", asyncHandler(controller.hierarchy));
router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.getOne));

// Only administrators may change anything
router.post("/", requireAdmin, validate(employeeSchema), asyncHandler(controller.create));
router.patch("/:id", requireAdmin, validate(updateEmployeeSchema), asyncHandler(controller.update));
router.delete("/:id", requireAdmin, asyncHandler(controller.remove));

export default router;