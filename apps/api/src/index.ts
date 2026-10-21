import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { prisma } from "./db";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import employeeRoutes from "./routes/employee.routes";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
const allowedOrigins = process.env.CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "skybranch-api" });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    const employees = await prisma.employee.count();
    res.json({ status: "ok", employees });
  } catch {
    res.status(500).json({ status: "error", message: "Database unreachable" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`SkyBranch API listening on port ${env.port}`);
});
