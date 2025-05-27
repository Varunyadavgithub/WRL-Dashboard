import { useState } from "react";
import Title from "../../components/common/Title";
import DateTimePicker from "../../components/common/DateTimePicker";
import InputField from "../../components/common/InputField";
import ExportButton from "../../components/common/ExportButton";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";
import Loader from "../../components/common/Loader";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const HoldCabinateDetails = () => {
  const groupingOptions = [
    { label: "ModelNo", value: "modelno" },
    { label: "FGSerialNo", value: "fgserialno" },
    { label: "HoldReason", value: "holdreason" },
    { label: "CorrectiveAction", value: "correctiveaction" },
    { label: "HoldBy", value: "holdby" },
    { label: "Status", value: "status" },
  ];
  const State = [
    { label: "Hold", value: "hold" },
    { label: "Release", value: "release" },
    { label: "All", value: "all" },
  ];

  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [state, setState] = useState(State[0]);
  const [holdCabinetDetails, setHoldCabinetDetails] = useState([]);
  const [groupingCondition, setGroupingCondition] = useState(
    groupingOptions[0]
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(1000);
  const [totalCount, setTotalCount] = useState(0);

  const fetchHoldCabietDetails = async (pageNumber = 1) => {
    if (!startTime || !endTime || !state) {
      toast.error("Please select State and Time Range.");
      return;
    }

    try {
      setLoading(true);
      const params = {
        status: state.value,
        startDate: startTime,
        endDate: endTime,
        page: pageNumber,
        limit,
      };
      const res = await axios.get(`${baseURL}quality/hold-cabinet-details`, {
        params,
      });

      if (res?.data?.success) {
        setHoldCabinetDetails(res?.data?.data);
        setTotalCount(res?.data?.totalCount);
        setTotalPages(Math.ceil(res?.data?.totalCount / limit));
        setPage(pageNumber);
      }
    } catch (error) {
      console.error("Failed to fetch production data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGroupedData = () => {
    if (!holdCabinetDetails.length || !groupingCondition) {
      return [];
    }

    const grouped = holdCabinetDetails.reduce((acc, item) => {
      const key = item[groupingCondition.label] || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, count]) => ({
      key,
      count,
    }));
  };

  const handleClearFilters = () => {
    setStartTime("");
    setEndTime("");
    setState(State[0]);
    setHoldCabinetDetails([]);
    setGroupingCondition(groupingOptions[0]);
    setPage(1);
    setTotalPages(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchHoldCabietDetails(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchHoldCabietDetails(page + 1);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-hidden max-w-full">
      <Title title="Hold Cabinate Details" align="center" />
      {/* Filters Section */}
      <div className="flex gap-4">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md max-w-4xl items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-center gap-2">
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
            <SelectField
              label="state"
              options={State}
              value={State.value}
              onChange={(e) => {
                const selected = State.find(
                  (item) => item.value === e.target.value
                );
                setState(selected);
              }}
              className="max-w-65"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-center gap-2">
            <InputField
              label="Details"
              type="text"
              placeholder="Enter details"
              className="w-full"
            />
            <div className="flex items-center justify-center">
              <div className="text-left font-bold text-lg">
                COUNT: <span className="text-blue-700">{totalCount || 0}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
                textColor={loading ? "text-white" : "text-black"}
                className={`font-semibold ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                onClick={() => fetchHoldCabietDetails(1)}
                disabled={loading}
              >
                Query
              </Button>
              <ExportButton
                data={holdCabinetDetails}
                filename="hold_cabinet_details"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-2">
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 my-4">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
              bgColor={page === 1 || loading ? "bg-gray-400" : "bg-blue-500"}
              textColor="text-white"
            >
              Previous
            </Button>
            <span className="font-semibold">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={page === totalPages || loading}
              bgColor={
                page === totalPages || loading ? "bg-gray-400" : "bg-blue-500"
              }
              textColor="text-white"
            >
              Next
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-1">
            {/* Left Side - Detailed Table */}
            <div className="w-full md:flex-1">
              {loading ? (
                <Loader />
              ) : (
                <div className="w-full max-h-[600px] overflow-x-auto">
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[120px]">
                          ModelNo
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          FGSerialNo
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          HoldReason
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Hold Date
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          HoldBy
                        </th>
                        <th className="px-1 py-1 border max-w-[120px]">
                          DaysOnHold
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          CorrectiveAction
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          ReleasedOn
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          ReleasedBy
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdCabinetDetails.length > 0 ? (
                        holdCabinetDetails.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 text-center"
                          >
                            <td className="px-1 py-1 border">{item.ModelNo}</td>
                            <td className="px-1 py-1 border">
                              {item.FGSerialNo}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.HoldReason}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.HoldDate &&
                                item.HoldDate.replace("T", " ").replace(
                                  "Z",
                                  ""
                                )}
                            </td>
                            <td className="px-1 py-1 border">{item.HoldBy}</td>
                            <td className="px-1 py-1 border">
                              {item.DaysOnHold}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.CorrectiveAction}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ReleasedOn &&
                                item.ReleasedOn.replace("T", " ").replace(
                                  "Z",
                                  ""
                                )}
                            </td>
                            <td className="px-1 py-1 border">
                              {item.ReleasedBy}
                            </td>
                            <td className="px-1 py-1 border">{item.Status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12} className="text-center py-4">
                            No data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Side - Controls and Summary */}
            <div className="w-full md:w-[30%] flex flex-col gap-2 overflow-x-hidden">
              {/* Filter + Export Buttons */}
              <div className="flex flex-wrap gap-2 items-center justify-center my-4">
                <Button
                  bgColor="bg-white"
                  textColor="text-black"
                  className="border border-gray-400 hover:bg-gray-100 px-3 py-1"
                  onClick={handleClearFilters}
                >
                  Clear Filter
                </Button>
                <ExportButton
                  data={getGroupedData}
                  filename="hold_cabinet_details_summary"
                />
              </div>
              <div className="bg-white border border-gray-300 rounded-md p-4">
                <h4 className="font-semibold mb-3">Grouping Condition</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <SelectField
                    label="Group"
                    options={groupingOptions}
                    value={groupingCondition.value}
                    onChange={(e) => {
                      const selected = groupingOptions.find(
                        (item) => item.value === e.target.value
                      );
                      setGroupingCondition(selected);
                    }}
                  />
                </div>
              </div>
              {/* Summary Table */}
              <div className="w-full max-h-[500px] overflow-x-auto">
                {loading ? (
                  <Loader />
                ) : (
                  <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                      <tr>
                        <th className="px-1 py-1 border min-w-[120px]">
                          {groupingCondition.label}
                        </th>
                        <th className="px-1 py-1 border min-w-[120px]">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getGroupedData().length > 0 ? (
                        getGroupedData().map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 text-center"
                          >
                            <td className="px-1 py-1 border">{item.key}</td>
                            <td className="px-1 py-1 border">{item.count}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-center py-4">
                            No data.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldCabinateDetails;
