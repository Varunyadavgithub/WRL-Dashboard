import express from "express";
import {
  getHourlyModelCount,
  getHourlySummary,
} from "../../controllers/production/hourlyReport.js";

const router = express.Router();
router.get("/hourly-summary", getHourlySummary);
router.get("/hourly-model-count", getHourlyModelCount);
export default router;
