import express from "express";
import {
  fetchExportData,
  getBarcodeDetails,
} from "../../controllers/production/totalProduction.js";

const router = express.Router();

router.get("/barcode-details", getBarcodeDetails);
router.get("/export-total-production", fetchExportData);

export default router;
