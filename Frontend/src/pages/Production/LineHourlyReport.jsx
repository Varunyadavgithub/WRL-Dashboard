import React from "react";
import Title from "../../components/common/Title";

const LineHourlyReport = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Line Hourly Report"
        subTitle="This report provides a detailed analysis of the production line's hourly performance, including output rates, efficiency metrics, and any deviations from expected performance."
        align="center"
      />

      {/* Time pickers */}
      <div className="flex flex-wrap gap-4 justify-center items-center my-6">
        <label className="flex items-center gap-2">
          Start Time:
          <input type="datetime-local" className="p-2 border rounded" />
        </label>
        <label className="flex items-center gap-2">
          End Time:
          <input type="datetime-local" className="p-2 border rounded" />
        </label>
        <button className="bg-yellow-300 px-4 py-2 rounded shadow hover:bg-yellow-400">
          REFRESH
        </button>
      </div>

      {/* Filter options */}
      <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
        <label><input type="radio" name="lineType" /> Final Line</label>
        <label><input type="radio" name="lineType" /> Post Foaming</label>
        <label><input type="radio" name="lineType" /> Foaming</label>
        <label><input type="checkbox" /> Auto Refresh</label>
        <label><input type="checkbox" /> Dispatch UPH</label>
      </div>

      {/* Line Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded shadow h-80 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold">Line</h3>
              <p className="text-sm">COUNT: 000</p>
            </div>
            <div className="h-40 flex items-end justify-center">
              <img src="/bar-chart-placeholder.png" alt="chart" className="h-full" />
              {/* Replace with actual chart later */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineHourlyReport;
