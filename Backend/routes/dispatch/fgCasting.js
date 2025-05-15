import express from "express";
import { getDispatchMasterBySession } from "../../controllers/dispatch/fgCasting.js";

const router = express.Router();

router.get("/fg-casting", getDispatchMasterBySession);

export default router;
