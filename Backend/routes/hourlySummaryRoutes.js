import express from "express";
import { getHourlySummary } from "../controllers/hourlySummaryController.js";

const router = express.Router();
router.get("/hourly-summary", getHourlySummary);
export default router;
