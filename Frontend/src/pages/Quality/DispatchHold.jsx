import axios from "axios";
import SelectField from "../../components/common/SelectField";
import Title from "../../components/common/Title";
import { useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import DateTimePicker from "../../components/common/DateTimePicker";
import Loader from "../../components/common/Loader";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DispatchHold = () => {
  const Status = [
    { label: "Hold", value: "hold" },
    { label: "Release", value: "release" },
  ];
  const Users = [
    { label: "Varun", value: "varun" },
    { label: "Abhinav", value: "abhinav" },
    { label: "Vikash", value: "vikash" },
    { label: "Rohit", value: "rohit" },
    { label: "Aman", value: "aman" },
  ];

  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [status, setStatus] = useState(Status[0]);
  const [user, setUser] = useState(Users[0]);
  const [startTime, setStartTime] = useState("");

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
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-hidden max-w-full">
      <Title title="Dispatch Hold" align="center" />

      {/* Filters Section */}
      <div className="flex gap-2">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="FG Serial No."
              type="text"
              placeholder="Enter FG Serial No."
              className="w-full"
            />
            <SelectField
              label="Model Name"
              options={variants}
              value={selectedVariant?.value || ""}
              onChange={(e) =>
                setSelectedVariant(
                  variants.find((opt) => opt.value === e.target.value) || 0
                )
              }
            />
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
              className="max-w-65"
            />
            <div className="flex items-center justify-center gap-2">
              <Button
                bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                textColor={loading ? "text-white" : "text-black"}
                className={`font-semibold ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                onClick={console.log("Upload btn clicked")}
                disabled={loading}
              >
                Upload
              </Button>
              <Button
                bgColor={loading ? "bg-gray-400" : "bg-green-500"}
                textColor={loading ? "text-white" : "text-black"}
                className={`font-semibold ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                onClick={console.log("Add FG btn clicked")}
                disabled={loading}
              >
                Add FG
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-2">
          {/* Right Side - Controls and Summary */}
          <div className="w-full  flex flex-col gap-2 overflow-x-hidden">
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
  );
};

export default DispatchHold;
