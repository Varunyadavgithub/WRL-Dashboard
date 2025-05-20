import { useState, useEffect } from "react";
import axios from "axios";
import Title from "../../components/common/Title";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FiveDaysPlanning = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("File upload failed", error);
      toast.error("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewFile = (file) => {
    const fileUrl = encodeURIComponent(`http://localhost:3000${file.url}`);
    window.open(
      `https://docs.google.com/gview?url=${fileUrl}&embedded=true`,
      "_blank"
    );
  };

  const handleDownloadFile = async (file) => {
    try {
      setLoading(true);
      const filename = file.url.split("/").pop();

      const res = await axios.get(`${baseURL}planing/download/${filename}`, {
        responseType: "blob", // important for binary files
      });

      // Create a blob URL
      const blob = new Blob([res.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create and click a temporary anchor element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", file.filename); // set correct filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("File download failed", error);
      toast.error("File download failed");
    } finally {
      setLoading(false);
    }
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
          className="border p-2 rounded bg-white shadow"
        />
        {loading && <Loader />}
      </div>

      {/* Files List */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <h3 className="text-xl font-bold mb-4 text-center text-purple-900">
          Available Excel Files
        </h3>

        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow-md p-4 border border-purple-300"
              >
                <h4 className="font-semibold text-gray-800 truncate">
                  {file.filename}
                </h4>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => handlePreviewFile(file)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Preview
                  </Button>
                  <Button
                    onClick={() => handleDownloadFile(file)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition text-center"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No files uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FiveDaysPlanning;
