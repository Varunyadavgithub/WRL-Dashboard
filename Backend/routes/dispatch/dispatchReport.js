import express from "express";
import { getDispatchUnloading } from "../../controllers/dispatch/dispatchReport.js";

const router = express.Router();

router.get("/fg-unloading", getDispatchUnloading);

export default router;
