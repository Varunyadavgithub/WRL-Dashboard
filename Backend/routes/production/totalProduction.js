import express from "express";
import { getBarcodeDetails } from "../../controllers/production/totalProduction.js";

const router = express.Router();

router.get("/barcode-details", getBarcodeDetails);

export default router;
