import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "skybranch-api" });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`SkyBranch API listening on port ${port}`);
});