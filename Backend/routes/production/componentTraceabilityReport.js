import express from "express";
import {
  fetchExportData,
  generateReport,
} from "../../controllers/production/componentTraceabilityReport.js";

const route = express.Router();

route.get("/component-traceability", generateReport);
route.get("/export-component-traceability", fetchExportData);

export default route;
