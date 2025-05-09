import express from "express";
import { getHourlySummary } from "../../controllers/production/hourlySummary.js";

const router = express.Router();
router.get("/hour-wise-production", getHourlySummary);
export default router;
