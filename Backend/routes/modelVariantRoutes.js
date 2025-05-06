import express from "express";
import { getModelVariants } from "../controllers/modelVariantController.js";

const router = express.Router();
router.get("/model-variants", getModelVariants);
export default router;
