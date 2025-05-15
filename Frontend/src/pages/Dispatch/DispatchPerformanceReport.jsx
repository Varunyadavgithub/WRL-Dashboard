import { useEffect, useState } from "react";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import DateTimePicker from "../../components/common/DateTimePicker";
import axios from "axios";
import Loader from "../../components/common/Loader";
import ExportButton from "../../components/common/ExportButton";

const DispatchPerformanceReport = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClearFilters = () => {
    setSelectedVariant(null);
    setSelectedStage(null);
    setStartTime("");
    setEndTime("");
    setProductionData([]);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="Hourly Report" align="center" />

      {/* Filters */}
      <div className="flex gap-2">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-4xl items-center justify-center">
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
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md mt-6">
          {/* Buttons and Checkboxes */}
          <div className="flex flex-col flex-wrap items-center gap-4">
            <div className="flex gap-4">
              <div>
                <div className="flex flex-col gap-1">
                  <label>
                    <input type="radio" name="lineType" /> Vehicle Loading UPH
                  </label>
                  <label>
                    <input type="radio" name="lineType" /> Model UPH
                  </label>
                  <label>
                    <input type="radio" name="lineType" /> Category UPH
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={console.log("Clicked")}
                  disabled={loading}
                >
                  Query
                </Button>
                <ExportButton />
              </div>
            </div>
            {/* Count */}
            <div className="mt-4 text-left font-bold text-lg">
              COUNT: <span className="text-blue-700">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex flex-col items-center mb-4">
          <span className="text-xl font-semibold">Summary</span>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-2">
          <div className="flex flex-col md:flex-row items-start gap-1">
            {/* Left Side - Detailed Table */}
            <div className="w-full md:flex-1">
              {loading ? (
                <Loader />
              ) : (
                <div className="w-full max-h-[600px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border max-w-[120px]">
                          Sr.No.
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Model_Name
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Model_No.
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Station_Code
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Assembly Sr.No
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Asset tag
                        </th>
                        <th className="px-1 py-1 border max-w-[120px]">
                          Customer_QR
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          UserName
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          FG Serial_No.
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          CreatedOn
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {productionData.length > 0 ? (
                        productionData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-1 py-1 border">{item.SrNo}</td>
                            <td className="px-1 py-1 border">
                              {item.Model_Name}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ModelName}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.StationCode}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.Assembly_Sr_No}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.Asset_tag}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.Customer_QR}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.UserName}
                            </td>
                            <td className="px-1 py-1 border">{item.FG_SR}</td>
                            <td className="px-1 py-1 border">
                              {item.CreatedOn &&
                                item.CreatedOn.replace("T", " ").replace(
                                  "Z",
                                  ""
                                )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12} className="text-center py-4">
                            No data found.
                          </td>
                        </tr>
                      )} */}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Side - Controls and Summary */}
            <div className="w-full md:w-[30%] flex flex-col gap-2 overflow-x-hidden">
              {/* Filter + Export Buttons */}
              <div className="flex flex-wrap gap-2 items-center justify-center my-4">
                <Button
                  bgColor="bg-white"
                  textColor="text-black"
                  className="border border-gray-400 hover:bg-gray-100 px-3 py-1"
                  onClick={handleClearFilters}
                >
                  Clear Filter
                </Button>
                <ExportButton />
              </div>

              {/* Summary Table */}
              <div className="w-full max-h-[500px] overflow-x-auto">
                {loading ? (
                  <Loader />
                ) : (
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[80px] md:min-w-[100px]">
                          Model_Name
                        </th>
                        <th className="px-1 py-1 border min-w-[80px] md:min-w-[100px]">
                          StartSerial
                        </th>
                        <th className="px-1 py-1 border min-w-[80px] md:min-w-[100px]">
                          EndSerial
                        </th>
                        <th className="px-1 py-1 border min-w-[80px] md:min-w-[100px]">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {productionData.length > 0 ? (
                        productionData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-1 py-1 border">
                              {item.Model_Name}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.StartSerial}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.EndSerial}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.TotalCount}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            No data found.
                          </td>
                        </tr>
                      )} */}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchPerformanceReport;
