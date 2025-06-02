import { useState } from "react";
import { exportToCSV } from "../../utils/exportToCSV.js";
import toast from "react-hot-toast";

const ExportButton = ({
  data,
  fetchData,
  filename = "export",
  className = "",
  label = "Export",
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    let exportData = data;

    if (typeof fetchData === "function") {
      try {
        exportData = await fetchData();
      } catch (error) {
        console.error("Failed to fetch data for export:", error);
        toast.error("Something went wrong while fetching data.");
        setLoading(false);
        return;
      }
    }

    if (!exportData || exportData.length === 0) {
      toast.error("No data available for export.");
      setLoading(false);
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const finalFilename = filename.endsWith(".csv")
      ? filename
      : `${filename}_${currentDate}.csv`;

    exportToCSV(exportData, finalFilename);
    setLoading(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`bg-green-600 text-black font-semibold px-4 py-2 rounded-md focus:outline-none cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? "Exporting..." : label}
    </button>
  );
};

export default ExportButton;
