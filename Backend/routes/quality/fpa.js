import express from "express";
import {
  getAssetDetails,
  getFpaCount,
  getFPQIDetails,
} from "../../controllers/quality/fpa.js";

const router = express.Router();

router.get("/fpa-count", getFpaCount);
router.get("/asset-details", getAssetDetails);
router.get("/fpqi-details", getFPQIDetails);

export default router;
