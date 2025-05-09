import express from "express";
import { getCurrentStageStatus } from "../../controllers/production/stageHistoryReport.js";

const route = express.Router();
route.get("/stage-history", getCurrentStageStatus);
export default route;
