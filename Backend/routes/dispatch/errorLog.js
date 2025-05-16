import express from "express";
import { getDispatchErrorLog } from "../../controllers/dispatch/errorLog.js";

const router = express.Router();

router.get("/error-log", getDispatchErrorLog);

export default router;
