import React from "react";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";

const Overview = () => {
  // Example option arrays (replace with actual dynamic data as needed)
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
    <div className="h-screen overflow-y-auto bg-gray-100 p-4">
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

          <div>
            <label className="block font-semibold mb-1">Stage Name</label>
            <div className="flex items-center gap-2">
              <SelectField options={stages} />
              <label className="flex items-center text-sm font-medium">
                <input type="checkbox" className="mr-1 accent-blue-500" />
                Test Stage
              </label>
            </div>
          </div>

          <SelectField label="Activity Type" options={activities} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-semibold mb-1">Start Time</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex flex-wrap items-end gap-2 mt-1">
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

        {/* Third Row */}
        <div className="mt-4">
          <InputField
            label="Details"
            type="text"
            placeholder="Enter details"
            className="w-full"
          />
        </div>

        {/* Count */}
        <div className="mt-4 text-right font-bold text-lg">
          COUNT: <span className="text-blue-700">000</span>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <Button
            bgColor="bg-white"
            textColor="text-black"
            className="border border-gray-400 hover:bg-gray-100"
            onClick={() => console.log("Clear Filter clicked")}
          >
            Clear Filter
          </Button>

          <span className="text-xl font-semibold">Summary</span>

          <Button
            bgColor="bg-yellow-300"
            textColor="text-black"
            className="font-semibold hover:bg-yellow-400"
            onClick={() => console.log("EXPORT clicked")}
          >
            EXPORT
          </Button>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-4">
          <h4 className="font-semibold mb-3">Grouping Condition</h4>
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
      </div>
    </div>
  );
};

export default Overview;
