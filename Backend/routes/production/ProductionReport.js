import express from "express";
import { fetchFGData } from "../../controllers/production/ProductionReport.js";

const router = express.Router();

router.get("/fgdata", fetchFGData);

export default router;
