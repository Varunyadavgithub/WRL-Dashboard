import React, { useState } from "react";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";
import DateTimePicker from "../../components/common/DateTimePicker";
import { useEffect } from "react";
import axios from "axios";
import ExportButton from "../../components/common/ExportButton";

const TotalProduction = () => {
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [totalProductionData, setTotalProductionData] = useState([]);

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

  useEffect(() => {
    fetchModelVariants();
  }, []);

  const fetchTotalProductionData = async () => {
    if (!startTime || !endTime) return;

    try {
      setLoading(true);

      const params = {
        startDate: startTime,
        endDate: endTime,
      };

      if (selectedVariant) {
        params.model = parseInt(selectedVariant.value, 10);
      } else {
        params.model = 0;
      }

      const res = await axios.get(
        "http://localhost:3000/api/v1/prod/barcode-details",
        { params }
      );
      setTotalProductionData(res);
    } catch (error) {
      console.error("Failed to fetch production data:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(totalProductionData);

  // Helper function to get category counts
  const getCategoryCounts = (data) => {
    const counts = {};
    data.forEach((item) => {
      const category = item.Category || "Unknown";
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  };

  const getModelNameCount = (data) => {
    const counts = {};
    data.forEach((item) => {
      const modelName = item.Model_Name || "Unknown";
      counts[modelName] = (counts[modelName] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="Total Production" align="center" />

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
                variants.find((opt) => opt.value === e.target.value) || 0
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
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-end gap-2 mt-4">
            <Button
              bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
              textColor={loading ? "text-white" : "text-black"}
              className={`font-semibold ${loading ? "cursor-not-allowed" : ""}`}
              onClick={() => fetchTotalProductionData()}
              disabled={loading}
            >
              Query
            </Button>
            <ExportButton />
          </div>

          {/* Count */}
          <div className="mt-4 text-left font-bold text-lg">
            COUNT:{" "}
            <span className="text-blue-700">
              {totalProductionData?.data?.recordsets?.[0]?.length || 0}{" "}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-col md:flex-row items-start gap-4 p-4">
            {/* Left Side - Wider */}
            <div className="w-full md:w-3/4">
              {/* Table 1 */}
              <div className="w-full max-h-[600px] overflow-x-auto">
                <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                  <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                    <tr>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Model_Name
                      </th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        FG Serial_No.
                      </th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Asset tag
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalProductionData?.data?.recordsets?.[0].length > 0 ? (
                      totalProductionData?.data?.recordsets[0].map(
                        (item, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-1 py-1 border min-w-[120px]">
                              {item.Model_Name}
                            </td>
                            <td className="px-1 py-1 border min-w-[120px]">
                              {item.FG_SR}
                            </td>
                            <td className="px-1 py-1 border min-w-[120px]">
                              {item.Asset_tag}
                            </td>
                          </tr>
                        )
                      )
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

            {/* Right Side - Narrower */}
            <div className="w-full md:w-1/4 flex flex-col">
              <div className="w-full flex-1">
                <div className="w-full max-h-[500px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[80px]">
                          Model_Name
                        </th>
                        <th className="px-1 py-1 border min-w-[80px]">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalProductionData?.data?.recordsets?.[0]?.length >
                      0 ? (
                        Object.entries(
                          getModelNameCount(
                            totalProductionData.data.recordsets[0]
                          )
                        ).map(([modelName, count], index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-1 py-1 border">{modelName}</td>
                            <td className="px-1 py-1 border">{count}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-center py-4">
                            No data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-full flex-1">
                <div className="w-full max-h-[500px] overflow-x-auto mt-6">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[80px]">
                          Category
                        </th>
                        <th className="px-1 py-1 border min-w-[80px]">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalProductionData?.data?.recordsets?.[0]?.length >
                      0 ? (
                        Object.entries(
                          getCategoryCounts(
                            totalProductionData.data.recordsets[0]
                          )
                        ).map(([category, count], index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-1 py-1 border">{category}</td>
                            <td className="px-1 py-1 border">{count}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-center py-4">
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
      </div>
    </div>
  );
};

export default TotalProduction;
