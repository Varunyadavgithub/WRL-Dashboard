import React, { useState, useEffect } from "react"; // ✅ useEffect imported in same line
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";
import DateTimePicker from "../../components/common/DateTimePicker";
import axios from "axios";

const ComponentTraceabilityReport = () => {
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [traceabilityData, setTraceabilityData] = useState([]);

  const fetchModelVariants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/shared/model-variants"
      );
      const formatted = res?.data.map((item) => ({
        label: item.MaterialName,
        value: item.MatCode.toString(),
      }));
      setVariants(formatted);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  const fetchTraceabilityData = async () => {
    if (!startTime || !endTime) return;

    try {
      setLoading(true);
      const params = {
        startTime,
        endTime,
        model: selectedVariant ? parseInt(selectedVariant.value, 10) : 0,
      };

      const res = await axios.get(
        "http://localhost:3000/api/v1/prod/component-traceability",
        { params }
      );
      setTraceabilityData(res.data);
    } catch (error) {
      console.error("Failed to fetch production data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelVariants();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Component Traceability Report"
        subTitle="This report provides a detailed traceability of components used in the production process, ensuring quality and compliance."
        align="center"
      />

      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Model Variant"
            options={variants}
            value={selectedVariant?.value || ""}
            onChange={(e) =>
              setSelectedVariant(
                variants.find((opt) => opt.value === e.target.value) || null
              )
            }
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <DateTimePicker
            label="Start Time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <DateTimePicker
            label="End Time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-wrap items-end gap-2 mt-4 w-full">
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={fetchTraceabilityData}
            >
              Query
            </Button>
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Export clicked")}
            >
              Export
            </Button>
            {/* Count */}
            <div className="mt-4 text-left font-bold text-lg">
              COUNT:{" "}
              <span className="text-blue-700">
                {traceabilityData.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-left bg-white rounded-lg">
                <thead className="text-center">
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">SAP_PO</th>
                    <th className="px-4 py-2 border">PS_No.</th>
                    <th className="px-4 py-2 border">Model_Name</th>
                    <th className="px-4 py-2 border">Reference Barcode</th>
                    <th className="px-4 py-2 border">Component Serial No.</th>
                    <th className="px-4 py-2 border">Component Name</th>
                    <th className="px-4 py-2 border">Component Type</th>
                    <th className="px-4 py-2 border">Supplier_Name</th>
                    <th className="px-4 py-2 border">Scanned On</th>
                    <th className="px-4 py-2 border">Fg Sr. No.</th>
                    <th className="px-4 py-2 border">Asset tag</th>
                    <th className="px-4 py-2 border">SAP Item Code</th>
                  </tr>
                </thead>
                <tbody>
                  {traceabilityData.length > 0 ? (
                    traceabilityData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">{item.SAP_PO || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.PS_No || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.Model_Name || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.ReferenceBarcode || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.ComponentSerialNo || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.ComponentName || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.ComponentType || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.Supplier_Name || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.ScannedOn || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.FgSrNo || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.AssetTag || "N/A"}</td>
                        <td className="px-4 py-2 border">{item.SAPItemCode || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="text-center py-4">
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentTraceabilityReport;
