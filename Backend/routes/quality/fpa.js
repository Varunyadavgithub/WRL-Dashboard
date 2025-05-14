import express from "express";
import { getFpaCount } from "../../controllers/quality/fpa.js";

const router = express.Router();

router.get("/fpa-count", getFpaCount);

export default router;
