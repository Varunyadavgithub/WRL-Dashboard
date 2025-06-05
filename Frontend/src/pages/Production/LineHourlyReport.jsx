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
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import FinalFreezer from "../../components/lineHourly/FinalLine/FinalFreezer";
import FinalChoc from "../../components/lineHourly/FinalLine/FinalChoc";
import FinalSUS from "../../components/lineHourly/FinalLine/FinalSUS";
import FinalCategoryCount from "../../components/lineHourly/FinalLine/FinalCategoryCount";
import PostFormingFreezerA from "../../components/lineHourly/PostForming/PostFormingFreezerA";
import PostFormingFreezerB from "../../components/lineHourly/PostForming/PostFormingFreezerB";
import PostFormingSUS from "../../components/lineHourly/PostForming/PostFormingSUS";
import PostFormingCategoryCount from "../../components/lineHourly/PostForming/PostFormingCategoryCount";
import FormingA from "../../components/lineHourly/Forming/FormingA";
import FormingB from "../../components/lineHourly/Forming/FormingB";
import FormingCategoryCount from "../../components/lineHourly/Forming/FormingCategoryCount";

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
  const [finalCategoryCountData, setFinalCategoryCountData] = useState([]);

  const [postFormingFreezerAData, setPostFormingFreezerAData] = useState([]);
  const [postFormingFreezerBData, setPostFormingFreezerBData] = useState([]);
  const [postFormingSUSData, setPostFormingSUSData] = useState([]);
  const [postCategoryCountData, setPostCategoryCountData] = useState([]);

  const [formingFOMAData, setFormingFOMAData] = useState([]);
  const [formingFOMBData, setFormingFOMBData] = useState([]);
  const [formingCategoryData, setFormingCategoryData] = useState([]);

  // API Base URL
  const API_BASE_URL = `${baseURL}prod`;

  // Fetch data for different line types
  const fetchHourlyReport = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select Time Range.");
      return;
    }

    setLoading(true);

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
    setPostCategoryCountData([]);
    setFinalCategoryCountData([]);

    // Common request parameters
    const params = {
      StartTime: startTime,
      EndTime: endTime,
    };

    try {
      // Handle Final Line data
      if (lineType === "final_line") {
        try {
          // Final Freezer
          const res1 = await axios.get(`${API_BASE_URL}/final-hp-frz`, {
            params,
          });
          setFinalFreezerData(res1?.data || []);

          // Final Choc
          const res2 = await axios.get(`${API_BASE_URL}/final-hp-choc`, {
            params,
          });
          setFinalChocData(res2?.data || []);

          // Final SUS
          const res3 = await axios.get(`${API_BASE_URL}/final-hp-sus`, {
            params,
          });
          setFinalSUSData(res3?.data || []);

          // Category Count
          const res4 = await axios.get(`${API_BASE_URL}/final-hp-cat`, {
            params,
          });
          setFinalCategoryCountData(res4?.data || []);
        } catch (error) {
          console.error("Error fetching Final Line data:", error);
          toast.error("Failed to fetch Final Line data");
        }
      }
      // Handle Post Forming data
      else if (lineType === "post_forming") {
        try {
          // Post Forming Freezer A
          const res1 = await axios.get(`${API_BASE_URL}/post-hp-frz-a`, {
            params,
          });
          setPostFormingFreezerAData(res1?.data || []);

          // Post Forming Freezer B
          const res2 = await axios.get(`${API_BASE_URL}/post-hp-frz-b`, {
            params,
          });
          setPostFormingFreezerBData(res2?.data || []);

          // Post Forming SUS
          const res3 = await axios.get(`${API_BASE_URL}/post-hp-sus`, {
            params,
          });
          setPostFormingSUSData(res3?.data || []);

          // Category Count
          const res4 = await axios.get(`${API_BASE_URL}/post-hp-cat`, {
            params,
          });
          setPostCategoryCountData(res4?.data || []);
        } catch (error) {
          console.error("Error fetching Post Forming data:", error);
          toast.error("Failed to fetch Post Forming data");
        }
      }
      // Handle Forming data
      else if (lineType === "forming") {
        try {
          // Forming FOM A
          const res1 = await axios.get(`${API_BASE_URL}/forming-hp-fom-a`, {
            params,
          });
          setFormingFOMAData(res1?.data || []);

          // Forming FOM B
          const res2 = await axios.get(`${API_BASE_URL}/forming-hp-fom-b`, {
            params,
          });
          setFormingFOMBData(res2?.data || []);

          // Forming Category
          const res3 = await axios.get(`${API_BASE_URL}/forming-hp-fom-cat`, {
            params,
          });
          setFormingCategoryData(res3?.data || []);
        } catch (error) {
          console.error("Error fetching Forming data:", error);
          toast.error("Failed to fetch Forming data");
        }
      }
    } catch (error) {
      console.error("Error in Fetch Hourly Report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto Refresh Logic
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchHourlyReport, 300000); // auto-refresh every 5 min
      return () => clearInterval(interval);
    }
  }, [autoRefresh, lineType, startTime, endTime]);

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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="flex flex-col bg-white border border-gray-300 rounded-md p-2">
          {/* Tables Component */}
          {loading ? (
            <Loader />
          ) : (
            <>
              {lineType === "final_line" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FinalFreezer
                      title={"Final Freezer"}
                      data={finalFreezerData}
                    />
                    <FinalChoc title={"Final Choc"} data={finalChocData} />
                    <FinalSUS title={"Final SUS"} data={finalSUSData} />
                    <FinalCategoryCount
                      title={"Category Count"}
                      data={finalCategoryCountData}
                    />
                  </div>
                </>
              )}

              {lineType === "post_forming" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <PostFormingFreezerA
                      title={"Foam Frz A"}
                      data={postFormingFreezerAData}
                    />
                    <PostFormingFreezerB
                      title={"Post Foam Frz B"}
                      data={postFormingFreezerBData}
                    />
                    <PostFormingSUS
                      title={"Post Foam SUS"}
                      data={postFormingSUSData}
                    />
                    <PostFormingCategoryCount
                      title={"Category Count"}
                      data={postCategoryCountData}
                    />
                  </div>
                </>
              )}

              {lineType === "forming" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormingA title={"Forming A"} data={formingFOMAData} />
                    <FormingB title={"Forming B"} data={formingFOMBData} />
                    <FormingCategoryCount
                      title={"Category Count"}
                      data={formingCategoryData}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineHourlyReport;
