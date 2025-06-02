import express from "express";
import {
  fetchComponentTracabilityExportData,
  generateReport,
} from "../../controllers/production/componentTraceabilityReport.js";

const route = express.Router();

route.get("/component-traceability", generateReport);
route.get(
  "/component-traceability-export-data",
  fetchComponentTracabilityExportData
);

export default route;
