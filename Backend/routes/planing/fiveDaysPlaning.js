import express from "express";
import { upload } from "../../middlewares/uploadMiddleware.js";
import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} from "../../controllers/planing/fiveDaysPlaning.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);
router.get("/download/:filename", downloadFile);
router.delete("/delete/:filename", deleteFile);

export default router;
