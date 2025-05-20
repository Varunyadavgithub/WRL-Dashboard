import React, { useState } from "react";
import Button from "../../components/common/Button";
import ExportButton from "../../components/common/ExportButton";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import DateTimePicker from "../../components/common/DateTimePicker";
import axios from "axios";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FGCasting = () => {
  const [loading, setLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [date, setDate] = useState("");
  const [fetchFgCastingData, setFetchFgCastingData] = useState([]);

  const fetchFgCastingDataBySession = async () => {
    if (!serialNumber) {
      toast.error("Please select Serial Number.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}dispatch/fg-casting`, {
        params: { sessionId: serialNumber },
      });
      const data = res.data;
      console.log(data);
      setFetchFgCastingData(data);
    } catch (error) {
      console.error("Failed to fetch fetch Fg Casting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSerialNumber("");
    setFetchFgCastingData([]);
  };

  const handleQuery = () => {
    fetchFgCastingDataBySession();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="FG Casting" align="center" />

      {/* Filters */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <InputField
            label="Serial Number"
            type="text"
            placeholder="Enter Serial Number"
            className="max-w-4xl"
            name="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
          <div className="flex items-center justify-center gap-4">
            <Button
              bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
              textColor={loading ? "text-white" : "text-black"}
              className={`font-semibold ${loading ? "cursor-not-allowed" : ""}`}
              onClick={handleQuery}
              disabled={loading}
            >
              Query
            </Button>
          </div>
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
        </div>

        {/* Second Row */}
        <div className="w-full">
          <fieldset className="border border-black p-4 rounded-md">
            <legend className="font-semibold text-gray-700 px-2">
              Casting Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Vehicle No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="vehicleNo"
                />
                <InputField
                  label="Lr No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="lrNo"
                />
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Transporter"
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="transporter"
                />
                <InputField
                  label="Location"
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="location"
                />
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Seal No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="sealNo"
                />
                <InputField
                  label="Driver Ph. No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="driverPhNo"
                />
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Invoice No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="invoiceNo"
                />
                <DateTimePicker
                  label="Date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Summary Section */}
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
                      <th className="px-1 py-1 border min-w-[120px]">Model</th>
                      <th className="px-1 py-1 border min-w-[120px]">Serial</th>
                      <th className="px-1 py-1 border min-w-[120px]">
                        Asset Code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchFgCastingData.length > 0 ? (
                      fetchFgCastingData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-1 py-1 border">{item.ModelName}</td>
                          <td className="px-1 py-1 border">{"N/A"}</td>
                          <td className="px-1 py-1 border">{item.AssetCode}</td>
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

export default FGCasting;
