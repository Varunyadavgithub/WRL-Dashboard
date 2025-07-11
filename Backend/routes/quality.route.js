import express from "express";
import {
  addDefect,
  getAssetDetails,
  getDefectCategory,
  getFpaCount,
  getFpaDefect,
  getFPQIDetails,
} from "../controllers/quality/fpa.js";
import {
  getFpaDailyReport,
  getFpaMonthlyReport,
  getFpaReport,
  getFpaYearlyReport,
} from "../controllers/quality/fpaReport.js";
import {
  addLptDefect,
  getLptAssetDetails,
  getLptDefectCategory,
  getLptDefectCount,
  getLptDefectReport,
} from "../controllers/quality/lpt.js";
import { getLptReport } from "../controllers/quality/lptReport.js";
import {
  deleteLptRecipe,
  getLptRecipe,
  insertLptRecipe,
  updateLptRecipe,
} from "../controllers/quality/LPTRecipe.js";
import {
  getModlelName,
  holdCabinet,
  releaseCabinet,
} from "../controllers/quality/dispatchHold.js";
import {
  getAssetTagDetails,
  newAssetTagUpdate,
  newCustomerQrUpdate,
} from "../controllers/quality/tagUpdate.js";

import {
  handleMulterError,
  uploadBISReportPDF,
} from "../middlewares/uploadMiddleware.js";
import {
  uploadBisPdfFile,
  getBisPdfFiles,
  downloadBisPdfFile,
  deleteBisPdfFile,
  updateBisPdfFile,
  getBisReportStatus,
} from "../controllers/quality/UploadBISReport.js";
import { getDispatchHoldDetails } from "../controllers/quality/holdCabinetDetails.js";
const router = express.Router();

// -----------------> FPA Routes
router.get("/fpa-count", getFpaCount);
router.get("/asset-details", getAssetDetails);
router.get("/fpqi-details", getFPQIDetails);
router.get("/fpa-defect", getFpaDefect);
router.get("/fpa-defect-category", getDefectCategory);
router.post("/add-fpa-defect", addDefect);

// -----------------> FPA Report Routes
router.get("/fpa-report", getFpaReport);
router.get("/fpa-daily-report", getFpaDailyReport);
router.get("/fpa-monthly-report", getFpaMonthlyReport);
router.get("/fpa-yearly-report", getFpaYearlyReport);

// -----------------> LPT Routes
router.get("/lpt-asset-details", getLptAssetDetails);
router.get("/lpt-defect-category", getLptDefectCategory);
router.post("/add-lpt-defect", addLptDefect);
router.get("/lpt-defect-report", getLptDefectReport);
router.get("/lpt-defect-count", getLptDefectCount);

// -----------------> LPT Report Routes
router.get("/lpt-report", getLptReport);

// -----------------> LPT Recipe Routes
router.get("/lpt-recipe", getLptRecipe);
router.delete("/lpt-recipe/:modelName", deleteLptRecipe);
router.post("/lpt-recipe", insertLptRecipe);
router.put("/lpt-recipe/:modelName", updateLptRecipe);

// -----------------> Dispatch Hold Routes
router.get("/model-name", getModlelName);
router.post("/hold", holdCabinet);
router.post("/release", releaseCabinet);

// -----------------> Tag Update Routes
router.get("/asset-tag-details", getAssetTagDetails);
router.put("/new-asset-tag", newAssetTagUpdate);
router.put("/new-customer-qr", newCustomerQrUpdate);

// -----------------> BIS Routes
router.post(
  "/upload-bis-pdf",
  uploadBISReportPDF.single("file"),
  handleMulterError,
  uploadBisPdfFile
);
router.get("/bis-files", getBisPdfFiles);
router.get("/download-bis-file/:srNo", downloadBisPdfFile);
router.delete("/delete-bis-file/:srNo", deleteBisPdfFile);
router.put(
  "/update-bis-file/:srNo",
  uploadBISReportPDF.single("file"),
  handleMulterError,
  updateBisPdfFile
);
router.get("/bis-status", getBisReportStatus);

// -----------------> Hold Cabinet Details Routes
router.get("/hold-cabinet-details", getDispatchHoldDetails);

export default router;
