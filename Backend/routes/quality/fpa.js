import express from "express";
import {
  getAssetDetails,
  getDefectCategory,
  getFpaCount,
  getFpaDefect,
  getFPQIDetails,
} from "../../controllers/quality/fpa.js";

const router = express.Router();

router.get("/fpa-count", getFpaCount);
router.get("/asset-details", getAssetDetails);
router.get("/fpqi-details", getFPQIDetails);
router.get("/fpa-defect", getFpaDefect);
router.get("/fpa-defect-category", getDefectCategory);

export default router;
