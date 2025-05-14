import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import DateTimePicker from "../../components/common/DateTimePicker";
import { useEffect, useState } from "react";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FPAReports = () => {
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reportType, setReportType] = useState("fpaReport");

  const fetchModelVariants = async () => {
    try {
      const res = await axios.get(`${baseURL}shared/model-variants`);
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
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="FPA Reports" align="center" />

      {/* Filters Section */}
      <div className="flex gap-4">
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
            label="Model Variant"
            options={variants}
            value={selectedVariant?.value || ""}
            onChange={(e) =>
              setSelectedVariant(
                variants.find((opt) => opt.value === e.target.value) || 0
              )
            }
          />
          <InputField
            label="Details"
            type="text"
            placeholder="Enter details"
            className="w-full"
          />
        </div>
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md mt-6">
          {/* Buttons and Checkboxes */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <div className="flex flex-col gap-1">
                <label>
                  <input
                    type="radio"
                    name="reportType"
                    value="fpaReport"
                    checked={reportType === "fpaReport"}
                    onChange={(e) => setReportType(e.target.value)}
                  />
                  Fpa Report
                </label>
                <label>
                  <input
                    type="radio"
                    name="reportType"
                    value="dailyFpaReport"
                    checked={reportType === "dailyFpaReport"}
                    onChange={(e) => setReportType(e.target.value)}
                  />
                  Daily FPA Report
                </label>
                <label>
                  <input
                    type="radio"
                    name="reportType"
                    value="monthlyFpaReport"
                    checked={reportType === "monthlyFpaReport"}
                    onChange={(e) => setReportType(e.target.value)}
                  />
                  Monthly Fpa Report
                </label>
                <label>
                  <input
                    type="radio"
                    name="reportType"
                    value="yearlyFpaReport"
                    checked={reportType === "yearlyFpaReport"}
                    onChange={(e) => setReportType(e.target.value)}
                  />
                  Yearly FPA Report
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={console.log("clicked")}
                  disabled={loading}
                >
                  Query
                </Button>
              </div>
              <div className="text-left font-bold text-lg">
                COUNT: <span className="text-blue-700">000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md"></div>
    </div>
  );
};

export default FPAReports;
