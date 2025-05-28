import express from "express";
import { generateReport } from "../../controllers/production/componentTraceabilityReport.js";

const route = express.Router();

route.get("/component-traceability", generateReport);

export default route;
