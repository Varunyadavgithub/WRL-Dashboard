import express from "express";
import { getFgUnloading } from "../../controllers/dispatch/dispatchReport.js";

const router = express.Router();

router.get("/fg-unloading", getFgUnloading);

export default router;
