import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import sharedRoutes from "./routes/sharedRoutes.js";
import fgDataRoutes from "./routes/production/fgData.js";
import hourlySummaryRoutes from "./routes/production/hourlySummary.js";
import componentTraceabilityRoute from "./routes/production/componentTraceability.js";
import stageHistory from "./routes/production/stageHistoryReport.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Connect to DB
connectDB();

// APIs
// Production API
app.use("/api/v1/shared", sharedRoutes); //✅
app.use("/api/v1/prod", fgDataRoutes); //✅
app.use("/api/v1/prod", hourlySummaryRoutes); //✅
app.use("/api/v1/prod", componentTraceabilityRoute); //✅
app.use("/api/v1/prod", stageHistory); //✅

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
