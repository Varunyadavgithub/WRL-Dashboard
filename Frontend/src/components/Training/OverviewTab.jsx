import {
  FaClipboardList,
  FaChalkboardTeacher,
  FaClock,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaPlayCircle,
} from "react-icons/fa";

import Button from "../common/Button";

export default function OverviewTab({ training }) {
  return (
    <div className="space-y-4">
      {/* ================= BASIC INFO GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Info
          icon={<FaClipboardList />}
          label="Training Type"
          value={training.TrainingType}
        />

        <Info
          icon={<FaChalkboardTeacher />}
          label="Trainer"
          value={training.TrainerName}
        />

        <Info icon={<FaPlayCircle />} label="Mode" value={training.Mode} />

        <Info
          icon={<FaClock />}
          label="Start Time"
          value={formatDateTime(training.StartDateTime)}
        />

        <Info
          icon={<FaClock />}
          label="End Time"
          value={formatDateTime(training.EndDateTime)}
        />

        <Info
          icon={<FaClock />}
          label="Duration"
          value={getDuration(training.StartDateTime, training.EndDateTime)}
        />

        <Info
          icon={<FaExclamationCircle />}
          label="Mandatory"
          value={training.Mandatory ? "Yes" : "No"}
          highlight={training.Mandatory}
        />
      </div>

      {/* ================= LOCATION BLOCK ================= */}
      <div className="bg-gray-50 border rounded-lg p-3">
        <div className="flex items-center gap-2 text-gray-700 mb-1">
          <FaMapMarkerAlt className="text-red-500 text-sm" />
          <h4 className="text-sm font-semibold">Training Location</h4>
        </div>

        <p className="text-sm text-gray-700 ml-5">
          {training.LocationDetails || "Location not defined"}
        </p>

        <div className="flex items-center gap-2 mt-2 ml-5 flex-wrap text-xs">
          {/* OFFLINE / CLASSROOM */}
          {training.Mode === "Classroom" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 border">
              <FaMapMarkerAlt className="text-xs text-gray-500" />
              On-site Training
            </span>
          )}

          {/* ONLINE */}
          {training.Mode === "Online" && training.OnlineLink && (
            <Button
              bgColor="bg-transparent"
              textColor="text-green-600"
              padding="px-3 py-1.5"
              borderRadius="rounded-md"
              className="border border-green-200 hover:bg-green-50 text-xs flex items-center gap-1"
              onClick={() => window.open(training.OnlineLink, "_blank")}
            >
              <FaPlayCircle className="text-sm" />
              Join
            </Button>
          )}

          {/* HYBRID */}
          {training.Mode === "Hybrid" && (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 border">
                <FaMapMarkerAlt className="text-xs text-gray-500" />
                On-site
              </span>

              {training.OnlineLink && (
                <Button
                  bgColor="bg-transparent"
                  textColor="text-green-600"
                  padding="px-3 py-1.5"
                  borderRadius="rounded-md"
                  className="border border-green-200 hover:bg-green-50 text-xs flex items-center gap-1"
                  onClick={() => window.open(training.OnlineLink, "_blank")}
                >
                  <FaPlayCircle className="text-sm" />
                  Join
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   COMPACT INFO CARD
   =============================== */
function Info({ icon, label, value, highlight }) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-0.5">
        {icon}
        <span>{label}</span>
      </div>

      <p
        className={`text-sm font-medium leading-tight ${
          highlight ? "text-red-600" : "text-gray-800"
        }`}
      >
        {value || "-"}
      </p>

      {highlight && (
        <span className="inline-block mt-0.5 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
          Mandatory
        </span>
      )}
    </div>
  );
}

/* ===============================
   HELPERS
   =============================== */
function getDuration(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate) || isNaN(endDate)) return "-";

  const diffMs = endDate - startDate;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${hours}h ${minutes}m`;
}

function formatDateTime(date) {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d)) return "-";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
