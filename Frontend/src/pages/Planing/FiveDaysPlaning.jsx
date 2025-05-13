import { useState, useEffect } from "react";
import axios from "axios";
import Title from "../../components/common/Title";
import Loader from "../../components/common/Loader";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FiveDaysPlanning = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch files on mount
  useEffect(() => {
    fetchFilesFromServer();
  }, []);

  const fetchFilesFromServer = async () => {
    try {
      const res = await axios.get(`${baseURL}planing/files`);
      setFiles(res.data.files);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  // Upload file to backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}planing/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFiles((prev) => [
        { id: Date.now(), filename: res.data.filename, url: res.data.fileUrl },
        ...prev,
      ]);

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      alert("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Preview file in Google Docs Viewer
  const previewFile = (file) => {
    const fileUrl = encodeURIComponent(`http://localhost:5000${file.url}`);
    window.open(
      `https://docs.google.com/gview?url=${fileUrl}&embedded=true`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-auto max-w-full">
      <Title title="Five Days Planning" align="center" />

      {/* Upload Section */}
      <div className="my-6 flex flex-col items-center gap-4">
        <label className="block text-lg font-semibold">
          Upload Excel File (Authorized User Only)
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border p-2 rounded bg-white"
        />
        {loading && <Loader />}
      </div>

      {/* Files List */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <h3 className="text-xl font-bold mb-2 text-center">
          Available Excel Files
        </h3>
        {files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between border-b py-2"
              >
                <span>{file.filename}</span>
                <button
                  onClick={() => previewFile(file)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
                >
                  Preview
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default FiveDaysPlanning;
