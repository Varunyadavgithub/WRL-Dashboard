import express from "express";
import { getStageNames } from "../controllers/stageNameController.js";

const router = express.Router();
router.get("/stage-names", getStageNames);
export default router;
