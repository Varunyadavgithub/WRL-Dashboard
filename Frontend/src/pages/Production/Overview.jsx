import React from "react";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";

const Overview = () => {
  const variants = [
    { label: "Variant A", value: "variant-a" },
    { label: "Variant B", value: "variant-b" },
    { label: "Variant C", value: "variant-c" },
  ];

  const stages = [
    { label: "Stage 1", value: "stage-1" },
    { label: "Stage 2", value: "stage-2" },
    { label: "Stage 3", value: "stage-3" },
  ];

  const activities = [
    { label: "Assembly", value: "assembly" },
    { label: "Testing", value: "testing" },
    { label: "Packaging", value: "packaging" },
  ];

  const groupingOptions = [
    { label: "Model", value: "model" },
    { label: "Stage", value: "stage" },
    { label: "Activity", value: "activity" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Title
        title="Production Overview"
        subTitle="Get a comprehensive view of the production process, including current status, efficiency metrics, and key performance indicators."
        align="center"
      />

      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField label="Model Variant" options={variants} />
          <SelectField label="Stage Name" options={stages} />
          <SelectField label="Activity Type" options={activities} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-semibold mb-1">Start Time</label>
            <input
              type="datetime-local"
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <input
              type="datetime-local"
              className="w-full p-1 border rounded-md"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <InputField
              label="Details"
              type="text"
              placeholder="Enter details"
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap items-end gap-2 mt-4 w-full">
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Refresh clicked")}
            >
              Refresh
            </Button>
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Export clicked")}
            >
              Export
            </Button>
            <label className="flex items-center text-sm font-medium">
              <input type="checkbox" className="mr-1 accent-blue-500" />
              Advanced View
            </label>
          </div>
        </div>

        {/* Count */}
        <div className="mt-4 text-left font-bold text-lg">
          COUNT: <span className="text-blue-700">000</span>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex flex-col items-center mb-4">
          <span className="text-xl font-semibold">Summary</span>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-col md:flex-row items-start gap-4 p-4">
            {/* Left Side - Wider */}
            <div className="w-full md:w-3/4">
              {/* Table 1 */}
              <div className="overflow-x-auto">
                <table className="min-w-full border text-left bg-white rounded-lg">
                  <thead className="text-center">
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 border">Model_Name</th>
                      <th className="px-4 py-2 border">Model_No.</th>
                      <th className="px-4 py-2 border">Station_Code</th>
                      <th className="px-4 py-2 border">Assembly Sr.No</th>
                      <th className="px-4 py-2 border">Asset tag</th>
                      <th className="px-4 py-2 border">Customer_QR</th>
                      <th className="px-4 py-2 border">FG Serial_No.</th>
                      <th className="px-4 py-2 border">createdOn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">Model_01</td>
                        <td className="px-4 py-2 border">01</td>
                        <td className="px-4 py-2 border">0001</td>
                        <td className="px-4 py-2 border">00011</td>
                        <td className="px-4 py-2 border">Asset_01</td>
                        <td className="px-4 py-2 border">FG-01</td>
                        <td className="px-4 py-2 border">05-5-2025</td>
                        <td className="px-4 py-2 border">Station_01</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side - Narrower */}
            <div className="w-full md:w-1/4 flex flex-col">
              <div className="w-full">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-4">
                    <Button
                      bgColor="bg-white"
                      textColor="text-black"
                      className="border border-gray-400 hover:bg-gray-100 p-1"
                      onClick={() => console.log("Clear Filter clicked")}
                    >
                      Clear Filter
                    </Button>

                    <Button
                      bgColor="bg-yellow-300"
                      textColor="text-black"
                      className="font-semibold hover:bg-yellow-400"
                      onClick={() => console.log("EXPORT clicked")}
                    >
                      EXPORT
                    </Button>
                  </div>
                  <h4 className="font-semibold mb-3">Grouping Condition</h4>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="font-medium">Group By</label>
                  <SelectField options={groupingOptions} />
                  <Button
                    bgColor="bg-blue-500"
                    textColor="text-white"
                    className="hover:bg-blue-600"
                    onClick={() => console.log("Go clicked")}
                  >
                    Go
                  </Button>
                </div>
              </div>

              <div className="w-full flex-1">
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full border text-left bg-white rounded-lg">
                    <thead className="text-center">
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 border">Model_Name</th>
                        <th className="px-4 py-2 border">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border">Model_01</td>
                          <td className="px-4 py-2 border">201</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
