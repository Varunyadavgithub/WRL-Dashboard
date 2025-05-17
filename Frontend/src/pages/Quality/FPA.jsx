import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import { useState } from "react";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";
import DateTimePicker from "../../components/common/DateTimePicker";
import axios from "axios";
import Loader from "../../components/common/Loader";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FPA = () => {
  const Shift = [
    { label: "Morning Shift", value: "shift 1" },
    { label: "Night Shift", value: "shift 2" },
  ];
  const defectCategories = [
    { label: "Crack", value: "crack" },
    { label: "Dent", value: "dent" },
    { label: "Scratch", value: "scratch" },
  ];
  const [loading, setLoading] = useState(false);
  const [barcodeNumber, setBarcodeNumber] = useState(null);
  const [country, setCountry] = useState("");
  const [shift, setShift] = useState(Shift[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [addManually, setAddManually] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    defectCategories[0].value
  );
  const [manualCategory, setManualCategory] = useState("");
  const [fpaCountData, setFpaDataCount] = useState([]);

  const handleFPACountQuery = async () => {
    if (!startTime || !endTime) {
      alert("Please select both start and end time");
      return;
    }

    try {
      setLoading(true);
      const params = {
        startDate: startTime,
        endDate: endTime,
      };

      const res = await axios.get(`${baseURL}quality/fpa-count`, { params });
      setFpaDataCount(res?.data);
    } catch (error) {
      console.error("Failed to fetch production data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-hidden max-w-full">
      <Title title="FPA" align="center" />

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Card */}
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Barcode & Search */}
            <div className="flex flex-col gap-4 items-start justify-center">
              <InputField
                label="Scan Barcode"
                type="text"
                placeholder="Enter Barcode Number"
                className="w-64"
                name="barcodeNumber"
                value={barcodeNumber}
                onChange={(e) => setBarcodeNumber(e.target.value)}
              />
              <Button
                bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                textColor={loading ? "text-white" : "text-black"}
                className={`font-semibold ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                onClick={console.log("Search btn clicked")}
                disabled={loading}
              >
                Search
              </Button>
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-3 justify-center text-center">
              <h1 className="font-bold text-lg">
                FG No: <span className="text-blue-700">0</span>
              </h1>
              <h1 className="font-bold text-lg">
                Asset No: <span className="text-blue-700">0</span>
              </h1>
              <h1 className="font-bold text-lg">
                Model Name: <span className="text-blue-700">0</span>
              </h1>
            </div>

            {/* Country & Shift */}
            <div className="flex flex-col gap-4 items-start justify-center">
              <h1 className="font-bold text-lg">
                No of Sample Inspected: <span className="text-blue-700">0</span>
              </h1>
              <InputField
                label="Country"
                type="text"
                placeholder="Enter Country"
                className="max-w-65"
                name="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <SelectField
                label="Shift"
                options={Shift}
                value={shift.value}
                onChange={(e) => {
                  const selected = Shift.find(
                    (item) => item.value === e.target.value
                  );
                  setShift(selected);
                }}
                className="max-w-65"
              />
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md w-full lg:max-w-xs flex flex-col items-center justify-center gap-4">
          <h1 className="font-bold text-2xl">FPQI</h1>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-lg">
                No. of Criticals: <span className="text-blue-700">0</span>
              </h1>
              <h1 className="font-semibold text-lg">
                No. of Majors: <span className="text-blue-700">0</span>
              </h1>
              <h1 className="font-semibold text-lg">
                No. of Miniors: <span className="text-blue-700">0</span>
              </h1>
            </div>
            <div className="text-center">
              <h1 className="font-semibold text-lg">
                FPQI Value: <span className="text-green-700">3.375</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-2">
          <div className="flex flex-col md:flex-row items-start gap-1">
            {/* Left Side */}
            <div className="w-full md:flex-1 flex flex-col gap-2">
              {/* Left Side Control */}
              <div className="flex flex-wrap gap-4 items-start justify-start bg-gradient-to-r from-purple-100 via-white to-purple-100 p-4 rounded-lg shadow-sm">
                <SelectField
                  label="Category"
                  options={Shift}
                  value={shift.value}
                  onChange={(e) => {
                    const selected = Shift.find(
                      (item) => item.value === e.target.value
                    );
                    setShift(selected);
                  }}
                  className="w-60"
                />

                <div className="flex flex-col gap-2 w-72">
                  {/* Radio Button Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="addManually"
                      checked={addManually}
                      onChange={() => setAddManually(!addManually)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor="addManually"
                      className="cursor-pointer font-medium"
                    >
                      Add Defect Manually
                    </label>
                  </div>

                  {/* Conditional Rendering */}
                  {addManually ? (
                    <InputField
                      label="Manual Defect Category"
                      type="text"
                      placeholder="Enter defect category"
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value)}
                    />
                  ) : (
                    <SelectField
                      label="Select Defect Category"
                      options={defectCategories}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                  )}
                </div>

                <InputField
                  label="Remark"
                  type="text"
                  placeholder="Enter Remark"
                  className="w-64"
                  name="barcodeNumber"
                  value={barcodeNumber}
                  onChange={(e) => setBarcodeNumber(e.target.value)}
                />

                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold h-fit mt-6 ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => console.log("Clicked")}
                  disabled={loading}
                >
                  Add Defect
                </Button>
              </div>

              {/* Left Side Table */}
              {loading ? (
                <Loader />
              ) : (
                <div className="w-full max-h-[600px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border">Sr.No.</th>
                        <th className="px-1 py-1 border">Date</th>
                        <th className="px-1 py-1 border">Model</th>
                        <th className="px-1 py-1 border">Shift</th>
                        <th className="px-1 py-1 border">FG Sr.No</th>
                        <th className="px-1 py-1 border">Category</th>
                        <th className="px-1 py-1 border">Add Defect</th>
                        <th className="px-1 py-1 border">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-100">
                        <td className="px-1 py-1 border">N/A</td>
                        <td className="px-1 py-1 border">N/A</td>
                        <td className="px-1 py-1 border">N/A</td>
                        <td className="px-1 py-1 border">N/A</td>
                        <td className="px-1 py-1 border">N/A</td>
                        <td className="px-1 py-1 border">N/A</td>
                        <td className="px-1 py-1 border">N/A</td>
                        <td className="px-1 py-1 border">N/A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="w-full md:w-[30%] flex flex-col gap-2 overflow-x-hidden">
              {/* Right Side Control */}
              <div className="flex flex-wrap gap-2 items-center justify-center bg-gradient-to-r from-purple-100 via-white to-purple-100 p-4 rounded-lg shadow-sm">
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
                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold h-fit mt-6 ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={handleFPACountQuery}
                  disabled={loading}
                >
                  Query
                </Button>
              </div>

              {/* Right Side Table */}
              {loading ? (
                <Loader />
              ) : (
                <div className="w-full max-h-[500px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border">Model Name</th>
                        <th className="px-1 py-1 border">Model Count</th>
                        <th className="px-1 py-1 border">FPA</th>
                        <th className="px-1 py-1 border">Sample Inspected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fpaCountData && fpaCountData.length > 0 ? (
                        fpaCountData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-1 py-1 border">
                              {item.ModelName}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ModelCount}
                            </td>
                            <td className="px-1 py-1 border">{item.FPA}</td>
                            <td className="px-1 py-1 border">
                              {item.SampleInspected}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
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
    </div>
  );
};

export default FPA;
