import React, { useState } from "react";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import InputField from "../../components/common/InputField";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineHourlyReport = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const hourData = [
    { hour: 1, count: 72 },
    { hour: 2, count: 85 },
    { hour: 3, count: 72 },
    { hour: 4, count: 22 },
    { hour: 5, count: 82 },
    { hour: 6, count: 40 },
    { hour: 7, count: 90 },
  ];

  const chartData = {
    labels: hourData.map((item) => `Hour ${item.hour}`),
    datasets: [
      {
        label: "Production Count",
        data: hourData.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Line Hourly Report"
        subTitle="This report provides a detailed analysis of the production line's hourly performance, including output rates, efficiency metrics, and any deviations from expected performance."
        align="center"
      />

      {/* Filters Section */}
      <div className="flex gap-4">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-4xl items-center">
          <InputField
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-0"
          />
          <InputField
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-0"
          />
        </div>
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md mt-6">
          {/* Buttons and Checkboxes */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={() => setAutoRefresh(!autoRefresh)}
                />
                Auto Refresh
              </label>
              <div className="flex flex-col gap-1">
                <label>
                  <input type="radio" name="lineType" /> Final Line
                </label>
                <label>
                  <input type="radio" name="lineType" /> Post Forming
                </label>
                <label>
                  <input type="radio" name="lineType" /> Forming
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <Button onClick={() => console.log("Refresh Clicked")}>
                  REFRESH
                </Button>
                <Button
                  bgColor="bg-green-600"
                  onClick={() => console.log("Export Clicked")}
                >
                  EXPORT
                </Button>
              </div>
              <div className="text-left font-bold text-lg">
                COUNT: <span className="text-blue-700">000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex flex-col bg-white border border-gray-300 rounded-md p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Final Freezer */}
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Final Freezer</h3>
                <div className="font-semibold text-lg">
                  Count: <span className="text-blue-700">000</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center">
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-left bg-white rounded-lg">
                    <thead className="text-center">
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 border">Hour No.</th>
                        <th className="px-4 py-2 border">Time Hour</th>
                        <th className="px-4 py-2 border">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item, index) => (
                        <tr key={index}>
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
            {/* Final Choc */}
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Final Choc</h3>
                <div className="font-semibold text-lg">
                  Count: <span className="text-blue-700">000</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center">
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full border text-left bg-white rounded-lg">
                    <thead className="text-center">
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 border">Hour No.</th>
                        <th className="px-4 py-2 border">Time Hour</th>
                        <th className="px-4 py-2 border">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item, index) => (
                        <tr key={index}>
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
            {/* Final SUS */}
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Final SUS</h3>
                <div className="font-semibold text-lg">
                  Count: <span className="text-blue-700">000</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center">
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full border text-left bg-white rounded-lg">
                    <thead className="text-center">
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 border">Hour No.</th>
                        <th className="px-4 py-2 border">Time Hour</th>
                        <th className="px-4 py-2 border">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item, index) => (
                        <tr key={index}>
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
            {/* Category Count */}
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Category Count</h3>
                <div className="font-semibold text-lg">
                  Count: <span className="text-blue-700">000</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center">
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
          {/* Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow mt-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="bg-white p-4 rounded shadow mt-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="bg-white p-4 rounded shadow mt-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="bg-white p-4 rounded shadow mt-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineHourlyReport;
