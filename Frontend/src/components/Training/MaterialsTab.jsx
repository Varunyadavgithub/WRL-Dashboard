import { useState } from "react";
import {
  FaUpload,
  FaLink,
  FaEye,
  FaDownload,
  FaTrashAlt,
  FaFilePowerpoint,
  FaFileAlt,
  FaVideo,
  FaExternalLinkAlt,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

import Button from "../common/Button";
import InputField from "../common/InputField";

/* ================= CONFIG ================= */
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "video/mp4",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_SIZE_MB = 10;

/* ================= COMPONENT ================= */
export default function MaterialsTab({ materials = [] }) {
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  /* ================= FILE VALIDATION ================= */
  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError("File size must be less than 10 MB");
      return false;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Only PDF, PPT, DOC, EXCEL, or MP4 files are allowed");
      return false;
    }

    setError("");
    setFile(selectedFile);
    return true;
  };

  const handleFileChange = (e) => {
    validateFile(e.target.files[0]);
  };

  /* ================= DRAG & DROP ================= */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    validateFile(e.dataTransfer.files[0]);
  };

  /* ================= UPLOAD SIMULATION ================= */
  const startUpload = () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setFile(null);
          alert("Upload completed (UI only)");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  /* ================= DELETE ================= */
  const handleDelete = (material) => {
    if (window.confirm(`Delete "${material.name}"?`)) {
      alert(`Deleted (UI only): ${material.name}`);
    }
  };

  /* ================= CATEGORY BADGE ================= */
  const getCategoryBadge = (category) => {
    const map = {
      PPT: { icon: <FaFilePowerpoint />, color: "bg-orange-100 text-orange-700" },
      SOP: { icon: <FaFileAlt />, color: "bg-purple-100 text-purple-700" },
      VIDEO: { icon: <FaVideo />, color: "bg-green-100 text-green-700" },
      LINK: { icon: <FaExternalLinkAlt />, color: "bg-blue-100 text-blue-700" },
      EXCEL: { icon: <FaFileAlt />, color: "bg-emerald-100 text-emerald-700" },
    };

    const cfg = map[category] || map.LINK;

    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${cfg.color}`}>
        {cfg.icon}
        {category}
      </span>
    );
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h3 className="font-semibold text-lg">Training Materials</h3>
        <p className="text-sm text-gray-600">
          Upload documents or share external learning resources.
        </p>
      </div>

      {/* DRAG & DROP UPLOAD */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition
          ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
      >
        <FaUpload className="mx-auto text-2xl text-blue-600 mb-2" />

        <p className="text-sm font-medium">
          Drag & drop file here or browse
        </p>

        <p className="text-xs text-gray-500 mt-1">
          PDF, PPT, DOC, EXCEL, MP4 (Max 10MB)
        </p>

        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="fileInput"
        />

        <label htmlFor="fileInput">
          <Button className="mt-3">Browse File</Button>
        </label>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        {file && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {uploading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Uploading... {progress}%
            </p>
          </div>
        )}

        <div className="mt-3">
          <Button disabled={!file || uploading} onClick={startUpload}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {/* ADD LINK */}
      <div className="border rounded-xl p-5 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <FaLink className="text-purple-600" />
          <p className="font-medium">Add External Link</p>
        </div>

        <InputField
          placeholder="Paste Google Drive / Teams / YouTube / URL"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <div className="mt-3">
          <Button
            disabled={!link}
            onClick={() => {
              alert(`Link added (UI only): ${link}`);
              setLink("");
            }}
          >
            Add Link
          </Button>
        </div>
      </div>

      {/* EXISTING MATERIALS */}
      <div>
        <p className="font-medium mb-3">Existing Materials</p>

        <div className="border rounded-xl divide-y bg-white">
          {materials.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No materials added yet
            </p>
          )}

          {materials.map((m) => (
            <div key={m.id} className="p-4 hover:bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCategoryBadge(m.category)}
                  <span className="font-medium text-sm">{m.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    bgColor="bg-transparent"
                    textColor="text-blue-600"
                    padding="p-2"
                    borderRadius="rounded-full"
                    className="hover:bg-blue-100 hover:scale-110 transition-all"
                  >
                    <FaEye className="w-5 h-5" />
                  </Button>

                  {m.type === "FILE" && (
                    <Button
                      bgColor="bg-transparent"
                      textColor="text-green-600"
                      padding="p-2"
                      borderRadius="rounded-full"
                      className="hover:bg-green-100 hover:scale-110 transition-all"
                    >
                      <FaDownload className="w-5 h-5" />
                    </Button>
                  )}

                  <Button
                    bgColor="bg-transparent"
                    textColor="text-red-600"
                    padding="p-2"
                    borderRadius="rounded-full"
                    className="hover:bg-red-100 hover:scale-110 transition-all"
                    onClick={() => handleDelete(m)}
                  >
                    <FaTrashAlt className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FaUser /> {m.uploadedBy}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt /> {m.uploadedOn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
