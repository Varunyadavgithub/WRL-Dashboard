import express from "express";
import {
  getModelVariants,
  getStageNames,
} from "../controllers/sharedController.js";

const router = express.Router();

router.get("/model-variants", getModelVariants);
router.get("/stage-names", getStageNames);

export default router;
