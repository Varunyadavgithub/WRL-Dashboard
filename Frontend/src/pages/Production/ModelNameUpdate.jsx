import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

const ModelNameUpdate = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Model Name Update"
        align="center"
      />
      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
        <div className="flex items-center gap-2">
          <div>
            <InputField
              label="FG Serial No."
              type="text"
              placeholder="Enter details"
              className="w-64"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Upload clicked")}
            >
              Upload
            </Button>
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Add FG clicked")}
            >
              Add FG
            </Button>
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
              onClick={() => console.log("Clear All clicked")}
            >
              Clear All
            </Button>

            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold hover:bg-yellow-400"
              onClick={() => console.log("Update clicked")}
            >
              Update
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Table 1 */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-left bg-white rounded-lg">
                <thead className="text-center">
                  <tr className="bg-gray-200">
                    <th className="px-1 py-1 border">Sr No.</th>
                    <th className="px-1 py-1 border">FG Serial No.</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 text-center">
                      <td className="px-1 py-1 border">01</td>
                      <td className="px-1 py-1 border">101</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table 2 */}
            {/* <div className="overflow-x-auto mt-6">
              <table className="min-w-full border text-left bg-white rounded-lg">
                <thead className="text-center">
                  <tr className="bg-gray-200">
                    <th className="px-1 py-1 border">Model_Name</th>
                    <th className="px-1 py-1 border">Model_No.</th>
                    <th className="px-1 py-1 border">Station_Code</th>
                    <th className="px-1 py-1 border">Assembly Sr.No</th>
                    <th className="px-1 py-1 border">Asset tag</th>
                    <th className="px-1 py-1 border">FG Serial_No.</th>
                    <th className="px-1 py-1 border">createdOn</th>
                    <th className="px-1 py-1 border">Station_Name</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 text-center">
                      <td className="px-1 py-1 border">Model_01</td>
                      <td className="px-1 py-1 border">01</td>
                      <td className="px-1 py-1 border">0001</td>
                      <td className="px-1 py-1 border">00011</td>
                      <td className="px-1 py-1 border">Asset_01</td>
                      <td className="px-1 py-1 border">FG-01</td>
                      <td className="px-1 py-1 border">05-5-2025</td>
                      <td className="px-1 py-1 border">Station_01</td>{" "}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelNameUpdate;
