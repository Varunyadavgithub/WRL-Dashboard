import { useState } from "react";
import InputField from "../../components/common/InputField";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";

const TagUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [assetNumber, setAssetNumber] = useState("");
  const [fgSerialNumber, setFgSerialNumber] = useState("");
  const [newAssetNumber, setNewAssetNumber] = useState("");

  const handleTagUpdateData = async () => {
    if (!serialNumber && !assetNumber && !fgSerialNumber && !newAssetNumber) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const params = {
        serialNumber: serialNumber,
        assetNumber: assetNumber,
        fgSerialNumber: fgSerialNumber,
        newAssetNumber: newAssetNumber,
      };
      const res = await axios.post(`${baseURL}dispatch/asset-tag`, {
        params,
      });
      console.log(res);
    } catch (error) {
      console.error("Failed to update the Asset Tag data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="Tag Update" align="center" />

      {/* Filters */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md flex flex-col gap-6">
        <div className="w-full">
          <fieldset className="border border-black p-4 rounded-md">
            <legend className="font-semibold text-gray-700 px-2">
              Asset Tag Update
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-4">
                <InputField
                  label="Serial Number"
                  type="text"
                  placeholder="Enter Serial Number"
                  className="max-w-4xl"
                  name="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <InputField
                  label="Asset No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="assetNumber"
                  value={assetNumber}
                  onChange={(e) => setAssetNumber(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4">
                <InputField
                  label="FG Sr.No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="fgSerialNumber"
                  value={fgSerialNumber}
                  onChange={(e) => setFgSerialNumber(e.target.value)}
                />
                <InputField
                  label="New Asset No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="newAssetNumber"
                  value={newAssetNumber}
                  onChange={(e) => setNewAssetNumber(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    console.log("Updated");
                  }}
                  disabled={loading}
                >
                  Update
                </Button>
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
            {/* {loading ? (
              <Loader />
            ) : (
              <div className="w-full max-h-[600px] overflow-x-auto">
                <table className=" border bg-white text-xs text-left rounded-lg table-auto">
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
                        <tr
                          key={index}
                          className="hover:bg-gray-100 text-center"
                        >
                          <td className="px-1 py-1 border">{item.ModelName}</td>
                          <td className="px-1 py-1 border">
                            {item.FGSerialNo}
                          </td>
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
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagUpdate;
