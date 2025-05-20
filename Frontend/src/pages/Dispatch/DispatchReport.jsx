import Title from "../../components/common/Title";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import DateTimePicker from "../../components/common/DateTimePicker";
import { useState } from "react";
import ExportButton from "../../components/common/ExportButton";
import Loader from "../../components/common/Loader";
import axios from "axios";
import toast from "react-hot-toast";
// import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DispatchReport = () => {
  const dispatchStageOptions = [
    { label: "FG Unloading", value: "fgunloading" },
    { label: "FG Inventory", value: "fginventory" },
    { label: "FG Dispatch", value: "fgdispatch" },
  ];

  const Status = [
    { label: "Completed", value: "completed" },
    { label: "Open", value: "open" },
  ];
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedStage, setSelectedStageOptions] = useState(
    dispatchStageOptions[0]
  );
  const [status, setStatus] = useState(Status[0]);
  const [fgUnloadingData, setFgUnloadingData] = useState([]);

  const fetchFgUnloadingData = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select Time Range.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}dispatch/fg-unloading`, {
        params: { startDate: startTime, endDate: endTime },
      });
      const data = res.data;
      console.log(data);
      setFgUnloadingData(data);
    } catch (error) {
      console.error("Failed to fetch fetch Fg Casting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = () => {
    if (selectedStage.value === "fgunloading") {
      fetchFgUnloadingData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Title title="Dispatch Report" align="center" />

      {/* Filters Section */}
      <div className="flex gap-2">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-4xl items-center">
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
          <SelectField
            label="Dispatch Stage"
            options={dispatchStageOptions}
            value={selectedStage?.value || ""}
            onChange={(e) => {
              const selected = dispatchStageOptions.find(
                (opt) => opt.value === e.target.value
              );
              if (selected) {
                setSelectedStageOptions(selected);
              }
            }}
          />
          {selectedStage.value === "fgdispatch" && (
            <SelectField
              label="Status"
              options={Status}
              value={Status.value}
              onChange={(e) => {
                const selected = Status.find(
                  (item) => item.value === e.target.value
                );
                setStatus(selected);
              }}
              className="max-w-32"
            />
          )}
        </div>
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md mt-6">
          {/* Buttons and Checkboxes */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={handleQuery}
                  disabled={loading}
                >
                  Query
                </Button>
                <ExportButton />
              </div>
              <div className="text-left font-bold text-lg">
                COUNT:{" "}
                <span className="text-blue-700">
                  {(fgUnloadingData && fgUnloadingData.length) || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Table 1 */}
            {loading ? (
              <Loader />
            ) : (
              <div className="w-full max-h-[600px] overflow-x-auto">
                <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                  <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                    <tr>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Model Name
                      </th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        FG Serial No.
                      </th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Asset Code
                      </th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Batch Code
                      </th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Scanner No.
                      </th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Date Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fgUnloadingData && fgUnloadingData.length > 0 ? (
                      fgUnloadingData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-1 py-1 border">{item.ModelName}</td>
                          <td className="px-1 py-1 border">
                            {item.FGSerialNo}
                          </td>
                          <td className="px-1 py-1 border">{item.AssetCode}</td>
                          <td className="px-1 py-1 border">{item.BatchCode}</td>
                          <td className="px-1 py-1 border">{item.ScannerNo}</td>
                          <td className="px-1 py-1 border">
                            {item.DateTime &&
                              item.DateTime.replace("T", " ").replace("Z", "")}
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
        </div>
      </div>
    </div>
  );
};

export default DispatchReport;
