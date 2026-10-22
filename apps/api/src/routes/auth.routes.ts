import { Router } from "express";
import rateLimit from "express-rate-limit";
import { changePassword, login, me, register, signup } from "../controllers/auth.controller";
import { registerGuard, requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  changePasswordSchema,
  credentialsSchema,
  loginSchema,
  signupSchema,
} from "../validators/auth.validator";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});

router.post("/register", authLimiter, registerGuard, validate(credentialsSchema), register);
router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", requireAuth, me);
router.post("/change-password", authLimiter, requireAuth, validate(changePasswordSchema), changePassword);

export default router;