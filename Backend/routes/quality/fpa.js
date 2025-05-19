import express from "express";
import { getAssetDetails, getFpaCount } from "../../controllers/quality/fpa.js";

const router = express.Router();

router.get("/fpa-count", getFpaCount);
router.get("/asset-details", getAssetDetails);

export default router;
