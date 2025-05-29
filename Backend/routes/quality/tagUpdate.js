import express from "express";
import {
  getAssetTagDetails,
  tagupdate,
} from "../../controllers/quality/tagUpdate.js";

const router = express.Router();

router.get("/asset-tag-details", getAssetTagDetails);
router.put("/asset-tag", tagupdate);

export default router;
