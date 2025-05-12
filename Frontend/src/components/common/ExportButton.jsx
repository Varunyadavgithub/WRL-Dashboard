import { exportToCSV } from "../../utils/exportToCSV.js";

const ExportButton = ({
  data,
  filename = "export",
  className = "",
  label = "Export",
}) => {
  const handleExport = () => {
    const currentDate = new Date().toISOString().split("T")[0]; // "2025-05-10"

    const finalFilename = filename.endsWith(".csv")
      ? filename
      : `${filename}_${currentDate}.csv`;
    exportToCSV(data, finalFilename);
  };

  return (
    <button
      onClick={handleExport}
      className={`bg-green-600 text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 focus:outline-none cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};

export default ExportButton;
