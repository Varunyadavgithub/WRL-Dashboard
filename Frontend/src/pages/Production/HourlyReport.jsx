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
  const [freezerLine, setFreezerLine] = useState(false);
  const [chocolateLine, setChocolateLine] = useState(false);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <SelectField
          label="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          options={modelOptions}
        />
        <SelectField
          label="Stage"
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

      {/* Buttons and Checkboxes */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <Button onClick={() => console.log("Refresh Clicked")}>
          REFRESH
        </Button>
        <Button
          bgColor="bg-green-600"
          onClick={() => console.log("Export Clicked")}
        >
          EXPORT
        </Button>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)}
          />
          Auto Refresh
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={freezerLine}
            onChange={() => setFreezerLine(!freezerLine)}
          />
          Freezer Line
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={chocolateLine}
            onChange={() => setChocolateLine(!chocolateLine)}
          />
          Chocolate Line
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border text-left bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Hour Number</th>
              <th className="px-4 py-2 border">Time Hour</th>
              <th className="px-4 py-2 border">Count</th>
            </tr>
          </thead>
          <tbody>
            {hourData.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 border">{item.hour}</td>
                <td className="px-4 py-2 border">
                  {`${item.hour}:00 - ${item.hour + 1}:00`}
                </td>
                <td className="px-4 py-2 border">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-4 rounded-lg shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default HourlyReport;
