import React from "react";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

function StageHistoryReport() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Stage History Report"
        subTitle="This report shows the history of each stage in the production process."
        align="center"
      />

      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
        <div className="flex flex-wrap items-center gap-4">
          <InputField
            label="Serial Number"
            type="text"
            placeholder="Enter details"
            className="w-64"
          />
          <div className="flex items-center justify-center gap-4">
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Query clicked")}
            >
              Query
            </Button>
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Export clicked")}
            >
              Export
            </Button>
          </div>
          {/* Product Name */}
          <div className="mt-4 text-left font-bold text-lg">
            Product Name: <span className="text-blue-700">EG3R354676R</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Table 1 */}
            <div className="overflow-x-auto w-full">
              <table className="min-w-full border text-left bg-white rounded-lg">
                <thead className="text-center">
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">PSNO</th>
                    <th className="px-4 py-2 border">Station_Code</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Alias</th>
                    <th className="px-4 py-2 border">Activity On</th>
                    <th className="px-4 py-2 border">V Serial</th>
                    <th className="px-4 py-2 border">Alias 1</th>
                    <th className="px-4 py-2 border">Serial</th>
                    <th className="px-4 py-2 border">Activity Type</th>
                    <th className="px-4 py-2 border">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StageHistoryReport;
