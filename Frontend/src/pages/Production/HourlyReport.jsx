import { useEffect, useState } from "react";
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
import SelectField from "../../components/common/SelectField";
import DateTimePicker from "../../components/common/DateTimePicker";
import axios from "axios";
import Loader from "../../components/common/Loader";
import ExportButton from "../../components/common/ExportButton";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const HourlyReport = () => {
  const [model, setModel] = useState([]);
  const [stage, setStages] = useState([]);
  const [stationCode, setStationCode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [hourData, setHourData] = useState([]);
  const [hourlyModelCount, setHourlyModelCount] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  const fetchModel = async () => {
    try {
      const res = await axios.get(`${baseURL}shared/model-variants`);
      const formatted = res?.data.map((item) => ({
        label: item.MaterialName,
        value: item.MatCode.toString(),
      }));
      setModel(formatted);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  const fetchStages = async () => {
    try {
      const res = await axios.get(`${baseURL}shared/stage-names`);
      const formatted = res?.data.map((item) => ({
        label: item.Name,
        value: item.StationCode,
      }));

      setStages(formatted);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  const fetchHourlyProduction = async () => {
    if (!stationCode || !startTime || !endTime) {
      return;
    }
    try {
      setLoading(true);

      const res = await axios.get(`${baseURL}prod/hourly-summary`, {
        params: {
          stationCode,
          startDate: startTime,
          endDate: endTime,
        },
      });
      setHourData(res.data);
    } catch (error) {
      console.error("Error fetching hourly production data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHourlyModelCount = async () => {
    if (!stationCode || !startTime || !endTime) {
      toast.error("Please select Station Code and Time Range.");
      return;
    }
    try {
      setLoading(true);
      const params = {
        stationCode,
        startDate: startTime,
        endDate: endTime,
      };
      if (selectedModel?.value && selectedModel.value !== "0") {
        params.model = selectedModel.value;
      }

      const res = await axios.get(`${baseURL}prod/hourly-model-count`, {
        params,
      });
      setHourlyModelCount(res?.data);
    } catch (error) {
      console.error("Error fetching hourly model count data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModel();
    fetchStages();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchHourlyProduction, 10000); // auto-refresh every 10s
      return () => clearInterval(interval);
    }
  }, [autoRefresh, stationCode, startTime, endTime]);

  // Chart Data
  const hourLabels = hourData.map((item) => `${item.TIMEHOUR}:00`);

  const chartData = {
    labels: hourLabels,
    datasets: [
      {
        label: "Production Count",
        data: hourData.map((item) => item.COUNT),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 5,
      },
    ],
  };

  // Calculate the maximum count value
  const counts = hourData.map((item) => item.COUNT);
  const maxCount = Math.max(...counts);

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour",
          font: {
            size: 16,
            weight: "bold",
            family: "font-playfair",
          },
          color: "#333",
        },
        ticks: {
          font: {
            size: 12,
            family: "font-playfair",
          },
          color: "#666",
        },
      },
      y: {
        beginAtZero: true,
        max: maxCount + 10,
        title: {
          display: true,
          text: "Count",
          font: {
            size: 16,
            weight: "bold",
            family: "font-playfair",
          },
          color: "#333",
        },
        ticks: {
          font: {
            size: 12,
            family: "font-playfair",
          },
          color: "#666",
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="Hourly Report" align="center" />

      {/* Filters */}
      <div className="flex gap-4">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-4xl">
          <SelectField
            label="Model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            options={model}
          />
          <SelectField
            label="Stage Name"
            name="stationCode"
            value={stationCode}
            onChange={(e) => setStationCode(e.target.value)}
            options={stage}
          />

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
        </div>
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md mt-6">
          {/* Buttons and Checkboxes */}
          <div className="flex flex-col flex-wrap items-center gap-4">
            <div className="flex gap-4">
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
                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={async () => {
                    await fetchHourlyProduction();
                    await fetchHourlyModelCount();
                  }}
                  disabled={loading}
                >
                  Query
                </Button>
                <ExportButton />
              </div>
            </div>
            {/* Count */}
            <div className="mt-4 text-left font-bold text-lg">
              COUNT:{" "}
              <span className="text-blue-700">
                {hourData?.reduce((sum, item) => sum + item.COUNT, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex items-center gap-4">
            {/* Table 1 */}
            <div className="w-1/2">
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full max-h-[600px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Hour Number
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Time Hour
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hourData && hourData.length > 0 ? (
                        hourData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100 text-center">
                            <td className="px-1 py-1 border">
                              {item.HOUR_NUMBER}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.TIMEHOUR}
                            </td>
                            <td className="px-1 py-1 border">{item.COUNT}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            No data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Table 2 */}
            <div className="w-1/2">
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full max-h-[600px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border">Time Hour</th>
                        <th className="px-1 py-1 border">Name</th>
                        <th className="px-1 py-1 border">Model Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hourlyModelCount.length > 0 ? (
                        hourlyModelCount.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100 text-center">
                            <td className="px-1 py-1 border">
                              {item.TIMEHOUR}
                            </td>
                            <td className="px-1 py-1 border">{item.Name}</td>
                            <td className="px-1 py-1 border">
                              {item.ModelCount}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            No data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full mx-auto mt-8 bg-white p-4 rounded-lg shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default HourlyReport;
