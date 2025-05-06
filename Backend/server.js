import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import modelVariantRoutes from "./routes/modelVariantRoutes.js";
import stageNameRoutes from "./routes/stageNameRoutes.js";
import hourlySummaryRoutes from "./routes/hourlySummaryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// APIs
app.use("/api", modelVariantRoutes);
app.use("/api", stageNameRoutes);
app.use("/api", hourlySummaryRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
