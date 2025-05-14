import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { connectDB } from "./config/db.js";

const _dirname = path.resolve();
// <------------------------------------------------------------- All API Routes ------------------------------------------------------------->
// <----- Shared Routes ----->
import sharedRoutes from "./routes/sharedRoutes.js";

// <----- Production Routes ----->
import ProductionReportRoutes from "./routes/production/ProductionReport.js";
import componentTraceabilityReportRoutes from "./routes/production/componentTraceabilityReport.js";
import hourlyReportRoutes from "./routes/production/hourlyReport.js";
import lineHourlyReportRoutes from "./routes/production/lineHourlyReport.js";
// import consolidatedReportRoutes from "./routes/consolidatedReport.js";
// import stopLossReportRoutes from "./routes/stopLossReport.js";
import stageHistoryReportRoutes from "./routes/production/stageHistoryReport.js";
// import modelNameUpdateRoutes from "./routes/modelNameUpdate.js";
import totalProductionRoutes from "./routes/production/totalProduction.js";

// <----- Quality Routes ----->
import fpaRoutes from "./routes/quality/fpa.js";

// <----- Planing Routes ----->
import fiveDaysPlaningRoutes from "./routes/planing/fiveDaysPlaning.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads"))); // Static files

// Serve the shared folder using your LAN IP
// app.use("/uploads", express.static("E:\\FiveDaysProductionPlan"));

// Connect to DB
connectDB();

// <------------------------------------------------------------- Test API Route ------------------------------------------------------------->
// app.get("/", (_, res) => {
//   res.status(200).json({ message: "Backend is working correctly!" });
// });

// <------------------------------------------------------------- APIs ------------------------------------------------------------->
// Shared API
app.use("/api/v1/shared", sharedRoutes); //✅

// Production API
app.use("/api/v1/prod", ProductionReportRoutes); //✅
app.use("/api/v1/prod", componentTraceabilityReportRoutes); //✅
app.use("/api/v1/prod", hourlyReportRoutes); //✅
app.use("/api/v1/prod", lineHourlyReportRoutes); //✅
// app.use("/api/v1/prod", consolidatedReportRoutes);
// app.use("/api/v1/prod", stopLossReportRoutes);
app.use("/api/v1/prod", stageHistoryReportRoutes); //✅
// app.use("/api/v1/prod", modelNameUpdateRoutes);
app.use("/api/v1/prod", totalProductionRoutes); //✅

// Quality API
app.use("/api/v1/quality", fpaRoutes);

// Planing API
app.use("/api/v1/planing", fiveDaysPlaningRoutes);

app.use(express.static(path.join(_dirname, "/Frontend/dist")));
// app.get("/*", (_, res) => {
//   res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
// });

// <------------------------------------------------------------- Start server ------------------------------------------------------------->
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
