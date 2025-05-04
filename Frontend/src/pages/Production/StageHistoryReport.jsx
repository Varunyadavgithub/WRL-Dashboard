import React from "react";
import Title from "../../components/common/Title";

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
        <div className="">
          <label className="">Serial Number</label>
          <input type="text" className="" placeholder="Enter Serial Number" />

          <div>
            <button className="bg-yellow-300 hover:bg-yellow-400 px-4 py-2 rounded-md font-semibold">
              Query
            </button>
            <button className="bg-yellow-300 hover:bg-yellow-400 px-4 py-2 rounded-md font-semibold">
              EXPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StageHistoryReport;
