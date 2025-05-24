import { useEffect, useState } from "react";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";
import axios from "axios";
import DateTimePicker from "../../components/common/DateTimePicker";
import Loader from "../../components/common/Loader";
import ExportButton from "../../components/common/ExportButton";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Overview = () => {
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [stages, setStages] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [productionData, setProductionData] = useState([]);

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

  const fetchStages = async () => {
    try {
      const res = await axios.get(`${baseURL}shared/stage-names`);
      const formatted = res?.data.map((item) => ({
        label: item.Name,
        value: item.StationCode.toString(),
      }));
      setStages(formatted);
    } catch (error) {
      console.error("Failed to fetch stages:", error);
    }
  };

  const fetchProductionData = async () => {
    if (startTime && endTime && (selectedVariant || selectedStage)) {
      setLoading(true);
      try {
        const params = {
          startTime,
          endTime,
          stationCode: selectedStage?.value || null,
        };

        // Add model to params only if a variant is selected
        if (selectedVariant) {
          params.model = parseInt(selectedVariant.value, 10);
        } else {
          params.model = 0;
        }

        const res = await axios.get(`${baseURL}prod/fgdata`, { params });
        setProductionData(res.data);
      } catch (error) {
        console.error("Failed to fetch production data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please select Stage and Time Range.");
    }
  };

  useEffect(() => {
    fetchModelVariants();
    fetchStages();
  }, []);

  const handleFgData = () => {
    fetchProductionData();
  };

  const handleClearFilters = () => {
    setSelectedVariant(null);
    setSelectedStage(null);
    setStartTime("");
    setEndTime("");
    setProductionData([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-hidden max-w-full">
      <Title title="Production Overview" align="center" />

      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
        <div className="flex flex-wrap gap-2">
          <SelectField
            label="Model Variant"
            options={variants}
            value={selectedVariant?.value || ""}
            onChange={(e) =>
              setSelectedVariant(
                variants.find((opt) => opt.value === e.target.value) || 0
              )
            }
            className="max-w-64"
          />

          <SelectField
            label="Stage Name"
            options={stages}
            value={selectedStage?.value || ""}
            onChange={(e) =>
              setSelectedStage(
                stages.find((opt) => opt.value === e.target.value) || 0
              )
            }
            className="max-w-64"
          />
        </div>

        {/* Second Row */}
        <div className="flex flex-wrap gap-2">
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
        <div className="flex flex-wrap gap-2">
          <div>
            <InputField
              label="Details"
              type="text"
              placeholder="Enter details"
              className="max-w-64"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
              textColor={loading ? "text-white" : "text-black"}
              className={`font-semibold ${loading ? "cursor-not-allowed" : ""}`}
              onClick={handleFgData}
              disabled={loading}
            >
              Query
            </Button>
            <ExportButton
              data={productionData}
              filename="Production_Report_Data"
            />
          </div>
        </div>

        {/* Count */}
        <div className="mt-4 text-left font-bold text-lg">
          COUNT:{" "}
          <span className="text-blue-700">{productionData?.length || 0}</span>
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
                      {productionData.length > 0 ? (
                        productionData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100 text-center">
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
                      )}
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
                      {productionData.length > 0 ? (
                        productionData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100 text-center">
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
                      )}
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

export default Overview;
