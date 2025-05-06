import React, { useState } from "react";
import Title from "../../components/common/Title";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const HourlyReport = () => {
  const [model, setModel] = useState("");
  const [stage, setStage] = useState("");
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

  const modelOptions = [
    { label: "Model 1", value: "model1" },
    { label: "Model 2", value: "model2" },
  ];

  const stageOptions = [
    { label: "Stage 1", value: "stage1" },
    { label: "Stage 2", value: "stage2" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Hourly Report"
        subTitle="This report provides a detailed overview of production metrics on an hourly basis, including output rates, efficiency, and quality assessments."
        align="center"
      />

      {/* Filters */}
      <div className="flex gap-4">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-4xl">
          <SelectField
            label="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            options={modelOptions}
          />
          <SelectField
            label="Stage Name"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            options={stageOptions}
          />
          <InputField
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <InputField
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
                  <input type="radio" name="lineType" /> Freezer Line
                </label>
                <label>
                  <input type="radio" name="lineType" /> Chocolate Line
                </label>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>

      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex items-center gap-4">
          {/* Table 1 */}
          <div className="overflow-x-auto w-1/2">
            <table className="min-w-full border text-left bg-white rounded-lg">
              <thead className="text-center">
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Hour Number</th>
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

          {/* Table 2 */}
          <div className="overflow-x-auto w-1/2">
            <table className="min-w-full border text-left bg-white rounded-lg">
              <thead className="text-center">
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Time Hour</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Model Count</th>
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

      {/* Chart */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-4 rounded-lg shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default HourlyReport;
