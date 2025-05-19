import express from "express";
import {
  getDispatchCategoryModelCount,
  getDispatchCategorySummary,
  getDispatchModelCount,
  getDispatchModelSummary,
  getDispatchVehicleSummary,
  getDispatchVehicleUPH,
} from "../../controllers/dispatch/performanceReport.js";

const router = express.Router();

router.get("/vehicle-uph", getDispatchVehicleUPH);
router.get("/vehicle-summary", getDispatchVehicleSummary);

router.get("/model-count", getDispatchModelCount);
router.get("/model-summary", getDispatchModelSummary);

router.get("/category-model-count", getDispatchCategoryModelCount);
router.get("/category-summary", getDispatchCategorySummary);

export default router;
