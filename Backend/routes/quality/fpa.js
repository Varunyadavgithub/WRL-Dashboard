import express from "express";
import {
  getAssetDetails,
  getFpaCount,
  getFpaDefect,
  getFPQIDetails,
} from "../../controllers/quality/fpa.js";

const router = express.Router();

router.get("/fpa-count", getFpaCount);
router.get("/asset-details", getAssetDetails);
router.get("/fpqi-details", getFPQIDetails);
router.get("/fpa-defect", getFpaDefect);

export default router;
