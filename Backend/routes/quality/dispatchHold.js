import express from "express";
import {
  getModlelName,
  holdCabinet,
  releaseCabinet,
} from "../../controllers/quality/dispatchHold.js";

const router = express.Router();

router.get("/model-name", getModlelName);
router.post("/hold", holdCabinet);
router.post("/release", releaseCabinet);

export default router;
