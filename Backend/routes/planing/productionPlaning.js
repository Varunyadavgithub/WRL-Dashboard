import express from "express";
import {
  addProductionPlaningData,
  getModelName,
  getPlanMonth,
  productionPlaningData,
} from "../../controllers/planing/productionPlaning.js";

const router = express.Router();

router.get("/plan-month-year", getPlanMonth);
router.get("/model-name", getModelName);
router.get("/production-planing", productionPlaningData);
router.put("/add-production-plan", addProductionPlaningData);

export default router;
