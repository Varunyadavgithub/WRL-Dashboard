import express from "express";
import {
  getFpaDailyReport,
  getFpaMonthlyReport,
  getFpaReport,
  getFpaYearlyReport,
} from "../../controllers/quality/fpaReport.js";

const router = express.Router();

router.get("/fpa-report", getFpaReport);
router.get("/fpa-daily-report", getFpaDailyReport);
router.get("/fpa-monthly-report", getFpaMonthlyReport);
router.get("/fpa-yearly-report", getFpaYearlyReport);

export default router;
