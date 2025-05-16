import Title from "../../components/common/Title";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { useState } from "react";
import DateTimePicker from "../../components/common/DateTimePicker";
import axios from "axios";
import ExportButton from "../../components/common/ExportButton";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ErrorLog = () => {
  const groupingOptions = [
    { label: "Model", value: "model" },
    { label: "Stage", value: "stage" },
    { label: "Activity", value: "activity" },
  ];

  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorLogData, setErrorLogData] = useState([]);

  const fetchErrorLogData = async () => {
    if (!startTime || !endTime) return;
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}dispatch/error-log`, {
        params: { startDate: startTime, endDate: endTime },
      });
      const data = res.data;
      console.log(data);
      setErrorLogData(data);
    } catch (error) {
      console.error("Failed to fetch Error Log data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = () => {
    fetchErrorLogData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Title title="Dispatch Error Log" align="center" />

      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex flex-wrap gap-4">
          <DateTimePicker
            label="Start Time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="max-w-64"
          />
          <DateTimePicker
            label="End Time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="max-w-64"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <InputField
            label="Filter"
            type="text"
            placeholder="Enter details"
            className="max-w-64"
          />
          <div className="flex flex-wrap items-end gap-2 mt-1">
            <Button
              bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
              textColor={loading ? "text-white" : "text-black"}
              className={`font-semibold ${loading ? "cursor-not-allowed" : ""}`}
              onClick={handleQuery}
              disabled={loading}
            >
              Query
            </Button>
            <ExportButton/>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex flex-col items-center mb-4">
          <span className="text-xl font-semibold">Summary</span>

          <div className="flex items-center gap-4 mt-4">
            <Button
              bgColor="bg-white"
              textColor="text-black"
              className="border border-gray-400 hover:bg-gray-100"
              onClick={() => console.log("Clear Filter clicked")}
            >
              Clear Filter
            </Button>

            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold hover:bg-yellow-400"
              onClick={() => console.log("EXPORT clicked")}
            >
              EXPORT
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-2">
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Left Side - Detailed Table */}
            <div className="w-full md:flex-1">
              {loading ? (
                <Loader />
              ) : (
                <div className="w-full max-h-[600px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Session ID
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          FG Serial No
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Asset No
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Model Name
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Model Code
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Error Message
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Error Name
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Error On.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorLogData && errorLogData.length > 0 ? (
                        errorLogData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-1 py-1 border">
                              {item.Session_ID}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.FGSerialNo}
                            </td>
                            <td className="px-1 py-1 border">{item.AssetNo}</td>
                            <td className="px-1 py-1 border">
                              {item.ModelName}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ModelCode}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ErrorMessage}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ErrorName}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ErrorOn &&
                                item.ErrorOn.replace("T", " ").replace("Z", "")}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            No data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Side - Controls and Summary */}
            <div className="w-full md:w-[30%] flex flex-col gap-2 overflow-x-hidden">
              <div className="bg-white border border-gray-300 rounded-md p-4">
                <h4 className="font-semibold mb-3">Grouping Condition</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="font-medium">Group By</label>
                  <SelectField options={groupingOptions} />
                  <Button
                    bgColor="bg-blue-500"
                    textColor="text-white"
                    className="hover:bg-blue-600"
                    onClick={() => console.log("Go clicked")}
                  >
                    Go
                  </Button>
                </div>
              </div>

              {/* Summary Table */}
              <div className="w-full max-h-[500px] overflow-x-auto">
                {loading ? (
                  <Loader />
                ) : (
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Model_Name
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-1 py-1 border">Model_01</td>
                          <td className="px-1 py-1 border">201</td>
                        </tr>
                      ))}
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

export default ErrorLog;
