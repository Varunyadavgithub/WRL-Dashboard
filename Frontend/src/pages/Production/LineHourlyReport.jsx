import { useEffect, useState } from "react";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import DateTimePicker from "../../components/common/DateTimePicker";
import ExportButton from "../../components/common/ExportButton";
import LineHourlyReportTables from "../../components/LineHourlyReportTables";
import LineHourlyReportCharts from "../../components/LineHourlyReportCharts";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineHourlyReport = () => {
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lineType, setLineType] = useState("final_line");

  // State for diffrent table data
  const [finalFreezerData, setFinalFreezerData] = useState([]);
  const [finalChocData, setFinalChocData] = useState([]);
  const [finalSUSData, setFinalSUSData] = useState([]);
  const [postFormingFreezerAData, setPostFormingFreezerAData] = useState([]);
  const [postFormingFreezerBData, setPostFormingFreezerBData] = useState([]);
  const [postFormingSUSData, setPostFormingSUSData] = useState([]);
  const [formingFOMAData, setFormingFOMAData] = useState([]);
  const [formingFOMBData, setFormingFOMBData] = useState([]);
  const [formingCategoryData, setFormingCategoryData] = useState([]);
  const [categoryCountData, setCategoryCountData] = useState([]);

  // API Base URL
  const API_BASE_URL = `${baseURL}prod`;

  // Fetch data for different line types and tables
  const fetchHourlyReport = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select Time Range.");
      return;
    }
    setLoading(true);
    try {
      const apiCalls = {
        final_line: [
          axios.get(`${API_BASE_URL}/final-hp-frz`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/final-hp-choc`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/final-hp-sus`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/final-hp-cat`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),
        ],

        post_forming: [
          axios.get(`${API_BASE_URL}/post-hp-frz-a`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/post-hp-frz-b`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/post-hp-sus`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/post-hp-cat`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),
        ],

        forming: [
          axios.get(`${API_BASE_URL}/forming-hp-fom-a`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/forming-hp-fom-b`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),

          axios.get(`${API_BASE_URL}/forming-hp-fom-cat`, {
            params: {
              StartTime: startTime,
              EndTime: endTime,
            },
          }),
        ],
      };

      const apiResults = await Promise.all(
        apiCalls[lineType].map(async (call) => {
          try {
            const response = await call;
            return response;
          } catch (error) {
            console.error(`API Call Error: ${error.message}`);
            console.error(`Request URL: ${error.config.url}`);
            console.error(`Request Params:`, error.config.params);
            return { data: [] };
          }
        })
      );

      // Reset previous data before setting new data
      setFinalFreezerData([]);
      setFinalChocData([]);
      setFinalSUSData([]);
      setPostFormingFreezerAData([]);
      setPostFormingFreezerBData([]);
      setPostFormingSUSData([]);
      setFormingFOMAData([]);
      setFormingFOMBData([]);
      setFormingCategoryData([]);
      setCategoryCountData([]);

      switch (lineType) {
        case "final_line":
          setFinalFreezerData(apiResults[0].data);
          setFinalChocData(apiResults[1].data);
          setFinalSUSData(apiResults[2].data);
          setCategoryCountData(apiResults[3].data);
          break;

        case "post_forming":
          setPostFormingFreezerAData(apiResults[0].data);
          setPostFormingFreezerBData(apiResults[1].data);
          setPostFormingSUSData(apiResults[2].data);
          setCategoryCountData(apiResults[3].data);
          break;

        case "forming":
          setFormingFOMAData(apiResults[0].data);
          setFormingFOMBData([apiResults[1].data]);
          setFormingCategoryData(apiResults[2].data);
          break;
      }
    } catch (error) {
      console.error("Error fetching hourly report:", error);
    } finally {
      setLoading(false);
    }
  };

  const tableConfigurations = {
    final_line: {
      tables: [
        {
          title: "Final Freezer",
          data: finalFreezerData,
        },

        {
          title: "Final Choc",
          data: finalChocData,
        },

        {
          title: "Final SUS",
          data: finalSUSData,
        },

        {
          title: "Category Count",
          data: categoryCountData,
        },
      ],
    },

    post_forming: {
      tables: [
        {
          title: "Freezer A",
          data: postFormingFreezerAData,
        },
        {
          title: "Freezer B",
          data: postFormingFreezerBData,
        },

        {
          title: "SUS",
          data: postFormingSUSData,
        },

        {
          title: "Category Count",
          data: categoryCountData,
        },
      ],
    },

    forming: {
      tables: [
        {
          title: "Forming A",
          data: formingFOMAData,
        },
        {
          title: "Forming B",
          data: formingFOMBData,
        },
        {
          title: "Category Count",
          data: formingCategoryData,
        },
      ],
    },
  };

  // Auto Refresh Logic (Optional)

  useEffect(() => {
    let intervalId;
    if (autoRefresh && startTime && endTime) {
      // Set up an interval to refresh data periodically
      intervalId = setInterval(() => {
        fetchHourlyReport();
      }, 30000); // Refresh every 30 seconds
    }

    // Cleanup interval on component unmount or when conditions change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, startTime, endTime, lineType]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="Line Hourly Report" align="center" />

      {/* Filters Section */}
      <div className="flex gap-4">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-4xl items-center">
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
                  <input
                    type="radio"
                    name="lineType"
                    value="final_line"
                    checked={lineType === "final_line"}
                    onChange={(e) => setLineType(e.target.value)}
                  />
                  Final Line
                </label>
                <label>
                  <input
                    type="radio"
                    name="lineType"
                    value="post_forming"
                    checked={lineType === "post_forming"}
                    onChange={(e) => setLineType(e.target.value)}
                  />
                  Post Forming
                </label>
                <label>
                  <input
                    type="radio"
                    name="lineType"
                    value="forming"
                    checked={lineType === "forming"}
                    onChange={(e) => setLineType(e.target.value)}
                  />
                  Forming
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <Button
                  bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                  textColor={loading ? "text-white" : "text-black"}
                  className={`font-semibold ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={fetchHourlyReport}
                  disabled={loading}
                >
                  Query
                </Button>
                <ExportButton />
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
          {/* Tables Component */}
          <LineHourlyReportTables
            tableConfigurations={tableConfigurations}
            lineType={lineType}
          />

          {/* Charts Component */}
          <LineHourlyReportCharts
            tableConfigurations={tableConfigurations}
            lineType={lineType}
          />
        </div>
      </div>
    </div>
  );
};

export default LineHourlyReport;
