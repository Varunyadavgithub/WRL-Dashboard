import express from "express";
import {
  fetchExportData,
  fetchFGData,
} from "../../controllers/production/ProductionReport.js";

const router = express.Router();

router.get("/fgdata", fetchFGData);
router.get("/export-production-report", fetchExportData);

export default router;
