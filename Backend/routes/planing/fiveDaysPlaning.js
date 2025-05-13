import express from "express";
import { upload } from "../../middlewares/uploadMiddleware.js";
import {
  uploadFile,
  getFiles,
} from "../../controllers/planing/fiveDaysPlaning.js";

const router = express.Router();

// Handle file upload
router.post("/upload", upload.single("file"), uploadFile);
// Fetch list of uploaded files
router.get("/files", getFiles);

export default router;
