import { useState } from "react";
import {
  FaClipboardList,
  FaUsers,
  FaFolderOpen,
  FaUserCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaExclamationCircle,
} from "react-icons/fa";

import Title from "../../components/common/Title";

// Tabs
import OverviewTab from "../../components/Training/OverviewTab";
import NominationTab from "../../components/Training/NominationTab";
import MaterialsTab from "../../components/Training/MaterialsTab";
import AttendanceTab from "../../components/Training/AttendanceTab";

export default function TrainingDetails() {
  /* ===============================
     VIEW STATE
     =============================== */
  const [view, setView] = useState("LIST"); // LIST | DETAIL
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [showSummary, setShowSummary] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL | UPCOMING | ONGOING | COMPLETED
  const [search, setSearch] = useState("");

  /* ===============================
     MULTIPLE TRAININGS (UI TEST DATA)
     =============================== */
  const trainings = [
    {
      TrainingID: 1,
      TrainingTitle: "Safety Training – Fire & Electrical",
      TrainingType: "Safety",
      TrainerName: "External Safety Officer",
      Mode: "OFFLINE",
      Mandatory: true,
      StartDateTime: "2026-03-12T10:00:00",
      EndDateTime: "2026-03-12T13:00:00",
      LocationDetails: "Training Room – Plant-1",
    },
    {
      TrainingID: 2,
      TrainingTitle: "Quality Awareness Training",
      TrainingType: "Quality",
      TrainerName: "QA Manager",
      Mode: "OFFLINE",
      Mandatory: false,
      StartDateTime: "2026-03-15T09:00:00",
      EndDateTime: "2026-03-15T11:00:00",
      LocationDetails: "QA Conference Room",
    },
    {
      TrainingID: 3,
      TrainingTitle: "Leadership & Soft Skills",
      TrainingType: "HR",
      TrainerName: "External Consultant",
      Mode: "Online",
      Mandatory: false,
      StartDateTime: "2025-12-01T14:00:00",
      EndDateTime: "2025-12-01T16:30:00",
      OnlineLink: "https://teams.microsoft.com",
    },
  ];

  /* ===============================
     COMMON DATA
     =============================== */
  const employeeList = [
    { employee_id: "WRLO0017", name: "Pravin Tambat" },
    { employee_id: "WRLP0005", name: "Kinjal Lad" },
    { employee_id: "WRLR0051", name: "Namdev Avhad" },
    { employee_id: "WRLS0041", name: "Sabirahmad Shekh" },
  ];

  const materialsList = [
    {
      id: 1,
      type: "FILE",
      category: "PPT",
      name: "Safety_Training_PPT.pdf",
      uploadedBy: "HR Admin",
      uploadedOn: "10 Mar 2026",
    },
    {
      id: 2,
      type: "LINK",
      category: "VIDEO",
      name: "Fire Safety Video (YouTube)",
      uploadedBy: "Safety Officer",
      uploadedOn: "11 Mar 2026",
    },
  ];

  /* ===============================
     STATUS LOGIC
     =============================== */
  const getTrainingStatus = (start, end) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);

    if (now < s) return "UPCOMING";
    if (now >= s && now <= e) return "ONGOING";
    return "COMPLETED";
  };

  const trainingDates = trainings.map((t) => t.StartDateTime);

  /* ===============================
     TABS
     =============================== */
  const tabs = [
    { key: "OVERVIEW", label: "Overview", icon: <FaClipboardList /> },
    { key: "NOMINATION", label: "Nomination", icon: <FaUsers /> },
    { key: "MATERIALS", label: "Materials", icon: <FaFolderOpen /> },
    { key: "ATTENDANCE", label: "Attendance", icon: <FaUserCheck /> },
  ];

  /* =============================== LIST VIEW (HORIZONTAL CARDS) =============================== */
  if (view === "LIST") {
    const filteredTrainings = trainings.filter((t) => {
      const status = getTrainingStatus(t.StartDateTime, t.EndDateTime);

      const matchesFilter = filter === "ALL" || status === filter;
      const matchesSearch =
        t.TrainingTitle.toLowerCase().includes(search.toLowerCase()) ||
        t.TrainerName.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    const statusBadge = {
      UPCOMING: "bg-blue-100 text-blue-700",
      ONGOING: "bg-green-100 text-green-700",
      COMPLETED: "bg-gray-200 text-gray-700",
    };

    return (
      <div className="bg-gray-50 p-6 rounded-xl border">
        <Title text="Training Register" />
        <h2 className="text-2xl font-bold text-gray-800">Training List</h2>
        <p className="text-sm text-gray-500 mb-6">
          View and manage all employee training programs
        </p>

        {/* FILTER + SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
          <div className="flex gap-2">
            {["ALL", "UPCOMING", "ONGOING", "COMPLETED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-4 py-1.5 rounded-md font-medium border
                ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search training or trainer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-4 py-2 text-sm w-full md:w-72
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* REGISTER LIST */}
        <div className="space-y-6">
          {filteredTrainings.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-10">
              No trainings found
            </div>
          )}

          {filteredTrainings.map((t, index) => {
            const status = getTrainingStatus(t.StartDateTime, t.EndDateTime);

            return (
              <div
                key={t.TrainingID}
                onClick={() => {
                  setSelectedTraining(t);
                  setView("DETAIL");
                }}
                className="bg-white border rounded-xl px-6 py-4
                         hover:shadow-md transition cursor-pointer"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {index + 1}. {t.TrainingTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Trainer: {t.TrainerName}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium
                    ${statusBadge[status]}`}
                  >
                    {status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
                  <Badge
                    icon={<FaCalendarAlt />}
                    text={new Date(t.StartDateTime).toLocaleDateString()}
                  />

                  <Badge
                    icon={<FaMapMarkerAlt />}
                    text={t.LocationDetails || "Online"}
                  />

                  <Badge icon={<FaClipboardList />} text={t.TrainingType} />

                  <Badge icon={<FaChalkboardTeacher />} text={t.Mode} />
                </div>

                {/* FLAGS */}
                {t.Mandatory && (
                  <div className="mt-3">
                    <span
                      className="inline-flex items-center gap-1
                                   bg-red-100 text-red-700
                                   px-3 py-1 rounded-full text-xs font-medium"
                    >
                      <FaExclamationCircle />
                      Mandatory Training
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ===============================  DETAIL VIEW  =============================== */
  const status = getTrainingStatus(
    selectedTraining.StartDateTime,
    selectedTraining.EndDateTime
  );

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <button
        onClick={() => setView("LIST")}
        className="text-xs text-blue-600 mb-2"
      >
        ← Back to Trainings
      </button>

      <Title text="Training Details" />

      {/* ================= SUMMARY ================= */}
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-semibold">Training Summary</h3>
        <button
          className="text-xs text-blue-600"
          onClick={() => setShowSummary(!showSummary)}
        >
          {showSummary ? "Hide" : "Show"}
        </button>
      </div>

      {showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <InfoCard
            icon={<FaCalendarAlt />}
            label="Schedule"
            value={`${selectedTraining.StartDateTime} → ${selectedTraining.EndDateTime}`}
          />
          <InfoCard
            icon={<FaMapMarkerAlt />}
            label="Location"
            value={selectedTraining.LocationDetails || "Online"}
          />
          <InfoCard
            icon={<FaChalkboardTeacher />}
            label="Trainer"
            value={selectedTraining.TrainerName}
          />
        </div>
      )}

      {/* ================= CALENDAR ================= */}
      <div className="flex justify-between mb-2">
        <h4 className="text-sm font-semibold">Monthly Calendar</h4>
        <button
          className="text-xs text-blue-600"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? "Hide" : "Show"}
        </button>
      </div>

      {showCalendar && <MonthlyCalendar trainingDates={trainingDates} />}

      {/* ================= TABS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 rounded-lg border text-sm
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-4">
        {activeTab === "OVERVIEW" && (
          <OverviewTab training={selectedTraining} />
        )}
        {activeTab === "NOMINATION" && (
          <NominationTab employees={employeeList} />
        )}
        {activeTab === "MATERIALS" && (
          <MaterialsTab materials={materialsList} />
        )}
        {activeTab === "ATTENDANCE" && <AttendanceTab />}
      </div>
    </div>
  );
}

/* ===============================
   HELPERS
   =============================== */

function StatusBadge({ status }) {
  const styles = {
    UPCOMING: "bg-blue-100 text-blue-700",
    ONGOING: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-200 text-gray-700",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] ${styles[status]}`}>
      {status}
    </span>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function MonthlyCalendar({ trainingDates = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const normalizedDates = trainingDates.map((d) => new Date(d).toDateString());

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-white border rounded-lg p-3 mb-4">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const date = new Date(year, month, day);
          const isToday = date.toDateString() === today.toDateString();
          const isTraining = normalizedDates.includes(date.toDateString());

          return (
            <div
              key={idx}
              className={`h-8 flex items-center justify-center rounded text-xs
                ${
                  isTraining
                    ? "bg-blue-600 text-white"
                    : isToday
                    ? "ring-1 ring-blue-400 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Badge({ icon, text }) {
  return (
    <span
      className="inline-flex items-center gap-2
                     bg-gray-100 text-gray-700
                     px-3 py-1 rounded-full text-xs font-medium"
    >
      {icon}
      {text}
    </span>
  );
}
