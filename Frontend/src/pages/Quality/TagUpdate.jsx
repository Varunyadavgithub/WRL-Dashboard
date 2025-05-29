import { useState } from "react";
import InputField from "../../components/common/InputField";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const TagUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [assemblyNumber, setAssemblyNumber] = useState("");
  const [fgSerialNumber, setFgSerialNumber] = useState("");
  const [assetNumber, setAssetNumber] = useState("");
  const [modelName, setModelName] = useState("");
  const [newAssetNumber, setNewAssetNumber] = useState("");
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);

  const fetchAssetDetails = async () => {
    if (!assemblyNumber) {
      toast.error("Assembly Number is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${baseURL}quality/asset-tag-details`, {
        params: { assemblyNumber },
      });

      setFgSerialNumber(res?.data?.FGNo);
      setAssetNumber(res?.data?.AssetNo);
      setModelName(res?.data?.ModelName);
    } catch (error) {
      console.error("Failed to fetch Asset Details data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagUpdateData = async () => {
    if (!assemblyNumber && !fgSerialNumber && !newAssetNumber) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      setIsUpdateDisabled(true);
      const payload = {
        assemblyNumber,
        fgSerialNumber,
        newAssetNumber,
      };

      const res = await axios.put(`${baseURL}quality/asset-tag`, payload);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error("Failed to update Asset Tag.");
      }
    } catch (error) {
      console.error("Failed to update the Asset Tag data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsUpdateDisabled(false);
  }, [assemblyNumber, fgSerialNumber, newAssetNumber]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="Tag Update" align="center" />

      {/* Filters */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md flex flex-col gap-6">
        <div>
          <fieldset className="border border-black p-4 rounded-md">
            <legend className="font-semibold text-gray-700 px-2">
              Asset Tag Update
            </legend>
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-4">
                  <InputField
                    label="Assembly Number"
                    type="text"
                    placeholder="Enter Assembly Number"
                    className="max-w-4xl"
                    name="assemblyNumber"
                    value={assemblyNumber}
                    onChange={(e) => {
                      setAssemblyNumber(e.target.value);
                      setIsUpdateDisabled(false);
                    }}
                  />
                  <div>
                    <Button
                      bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                      textColor={loading ? "text-white" : "text-black"}
                      className={`font-semibold ${
                        loading ? "cursor-not-allowed" : ""
                      }`}
                      onClick={() => fetchAssetDetails()}
                      disabled={loading}
                    >
                      Query
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <InputField
                    label="New Asset No."
                    type="text"
                    placeholder="Enter details"
                    className="max-w-4xl"
                    name="newAssetNumber"
                    value={newAssetNumber}
                    onChange={(e) => setNewAssetNumber(e.target.value)}
                  />
                  <div>
                    <Button
                      bgColor={
                        loading || isUpdateDisabled
                          ? "bg-gray-400"
                          : "bg-blue-500"
                      }
                      textColor={
                        loading || isUpdateDisabled
                          ? "text-white"
                          : "text-black"
                      }
                      className={`font-semibold ${
                        loading || isUpdateDisabled ? "cursor-not-allowed" : ""
                      }`}
                      onClick={handleTagUpdateData}
                      disabled={loading || isUpdateDisabled}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="font-semibold text-xl">
                  Asset No.{" "}
                  <span className="text-blue-700 text-md">
                    {assetNumber || 0}
                  </span>
                </h1>

                <h1 className="font-semibold text-xl">
                  FG Sr.No.{" "}
                  <span className="text-blue-700 text-md">
                    {fgSerialNumber || 0}
                  </span>
                </h1>
                <h1 className="font-semibold text-xl">
                  Model Name{" "}
                  <span className="text-blue-700 text-md">
                    {modelName || 0}
                  </span>
                </h1>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default TagUpdate;
