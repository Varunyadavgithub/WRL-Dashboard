import express from "express";
import { getDispatchHoldDetails } from "../../controllers/quality/holdCabinetDetails.js";

const router = express.Router();

router.get("/hold-cabinet-details", getDispatchHoldDetails);

export default router;
