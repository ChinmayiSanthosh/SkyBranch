import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, me, register } from "../controllers/auth.controller";
import { registerGuard, requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { credentialsSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    limit:20,
    standardHeaders:true,
    legacyHeaders:false,
    message:{ error: "Too many attempts, please try again later"},

});

router.post("/register", authLimiter, registerGuard, validate(credentialsSchema), register);
router.post("/login",authLimiter, validate(credentialsSchema),login);
router.get("/me", requireAuth,me);
router.post("/login", authLimiter, validate(loginSchema), login);

export default router;

