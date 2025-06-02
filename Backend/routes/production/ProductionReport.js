import express from "express";
import {
  fetchFGData,
  fetchFGExportData,
} from "../../controllers/production/ProductionReport.js";

const router = express.Router();

router.get("/fgdata", fetchFGData);
router.get("/export-fgdata", fetchFGExportData);

export default router;
