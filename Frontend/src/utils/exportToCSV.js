import toast from "react-hot-toast";

export const exportToCSV = (data, filename = "export.csv") => {
  // Check if there is any data to export
  if (!data || !data.length) {
    toast.error("No data to export!");
    return;
  }

  // Extract headers from the first item in the data
  const headers = Object.keys(data[0]);

  // Map through data and convert it to CSV format
  const csvRows = [];
  csvRows.push(headers.join(",")); // Add headers as the first row
  data.forEach((row) => {
    csvRows.push(headers.map((header) => row[header] || "").join(","));
  });

  // Create a CSV Blob
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Create an anchor element to trigger the download
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
