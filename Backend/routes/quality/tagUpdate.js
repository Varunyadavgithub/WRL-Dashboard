import express from "express";
import {
  getAssetTagDetails,
  newAssetTagUpdate,
  newCustomerQrUpdate,
} from "../../controllers/quality/tagUpdate.js";

const router = express.Router();

router.get("/asset-tag-details", getAssetTagDetails);
router.put("/new-asset-tag", newAssetTagUpdate);
router.put("/new-customer-qr", newCustomerQrUpdate);

export default router;
