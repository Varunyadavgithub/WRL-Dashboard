import React, { useState } from "react";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";
import DateTimePicker from "../../components/common/DateTimePicker";

const TotalProduction = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const variants = [
    { label: "Variant A", value: "variant-a" },
    { label: "Variant B", value: "variant-b" },
    { label: "Variant C", value: "variant-c" },
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
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Total Production"
        subTitle="This report provides a comprehensive overview of the total production output, including quantities produced, production rates, and any discrepancies or issues encountered during the production process."
        align="center"
      />
      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField label="Model Variant" options={variants} />
          <SelectField label="Activity Type" options={activities} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
          {/* <div>
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
          </div> */}
        </div>

        {/* Third Row */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-end gap-2 mt-4">
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
          </div>

          {/* Count */}
          <div className="mt-4 text-left font-bold text-lg">
            COUNT: <span className="text-blue-700">000</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-col md:flex-row items-start gap-4 p-4">
            {/* Left Side - Wider */}
            <div className="w-full md:w-3/4">
              {/* Table 1 */}
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full border text-left bg-white rounded-lg">
                  <thead className="text-center">
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 border">Model_Name</th>
                      <th className="px-4 py-2 border">FG Serial_No.</th>
                      <th className="px-4 py-2 border">Asset tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">Model_01</td>
                        <td className="px-4 py-2 border">01</td>
                        <td className="px-4 py-2 border">0001</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side - Narrower */}
            <div className="w-full md:w-1/4 flex flex-col">
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

              <div className="w-full flex-1">
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full border text-left bg-white rounded-lg">
                    <thead className="text-center">
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 border">Category</th>
                        <th className="px-4 py-2 border">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item, index) => (
                        <tr key={index}>
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
      </div>
    </div>
  );
};

export default TotalProduction;
