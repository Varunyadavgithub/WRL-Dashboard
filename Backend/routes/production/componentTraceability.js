import express from "express";
import { generateReport } from "../../controllers/production/componentTraceability.js";

const route = express.Router();

route.get("/component-traceability", generateReport);
export default route;
