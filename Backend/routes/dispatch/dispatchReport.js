import express from "express";
import {
  getFgDispatch,
  getFgUnloading,
} from "../../controllers/dispatch/dispatchReport.js";

const router = express.Router();

router.get("/fg-unloading", getFgUnloading);
router.get("/fg-dispatch", getFgDispatch);

export default router;
