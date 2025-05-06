import React from "react";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";

const FPAReports = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="FPA Reports"
        subTitle="This report provides a detailed analysis of the FPA."
        align="center"
      />
      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
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

        {/* Second Row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-start gap-2 mt-4">
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Refresh clicked")}
            >
              Refresh
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <label>
              <input type="radio" name="lineType" /> Final Line
            </label>
            <label>
              <input type="radio" name="lineType" /> Post Foaming
            </label>
            <label>
              <input type="radio" name="lineType" /> Foaming
            </label>
            <label>
              <input type="checkbox" /> Auto Refresh
            </label>
          </div>
        </div>

        {/* Count */}
        <div className="mt-4 text-left font-bold text-lg">
          COUNT: <span className="text-blue-700">000</span>
        </div>
      </div>
    </div>
  );
};

export default FPAReports;
