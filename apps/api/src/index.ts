import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import {prisma} from "./db";

const app = express();

app.use(helmet());
app.use(cors());
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

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`SkyBranch API listening on port ${port}`);
});