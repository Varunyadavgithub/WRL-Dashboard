import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

import Title from "../../components/common/Title";
import TrainingDetails from "./TrainingDetails";

export default function TrainingList() {
  const [selectedTraining, setSelectedTraining] = useState(null);

  const trainings = [
    {
      TrainingID: 1,
      TrainingTitle: "Safety Training – Fire & Electrical",
      TrainerName: "External Safety Officer",
      StartDateTime: "2026-03-12T10:00:00",
      EndDateTime: "2026-03-12T13:00:00",
      LocationDetails: "Plant 1 – Training Room",
    },
    {
      TrainingID: 2,
      TrainingTitle: "Quality Awareness Program",
      TrainerName: "QA Manager",
      StartDateTime: "2026-03-18T09:00:00",
      EndDateTime: "2026-03-18T11:00:00",
      LocationDetails: "QA Conference Hall",
    },
    {
      TrainingID: 3,
      TrainingTitle: "Leadership & Soft Skills",
      TrainerName: "HR Consultant",
      StartDateTime: "2025-12-01T10:00:00",
      EndDateTime: "2025-12-01T13:00:00",
      LocationDetails: "Microsoft Teams",
    },
  ];

  const getStatus = (start, end) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);

    if (now < s) return "UPCOMING";
    if (now >= s && now <= e) return "ONGOING";
    return "COMPLETED";
  };

  // 👉 If training selected → show details
  if (selectedTraining) {
    return (
      <TrainingDetails
        training={selectedTraining}
        onBack={() => setSelectedTraining(null)}
      />
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <Title text="Trainings" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trainings.map((t) => {
          const status = getStatus(t.StartDateTime, t.EndDateTime);

          return (
            <div
              key={t.TrainingID}
              onClick={() => setSelectedTraining(t)}
              className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm">{t.TrainingTitle}</p>
                <StatusBadge status={status} />
              </div>

              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <FaCalendarAlt />
                {new Date(t.StartDateTime).toLocaleDateString()}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Trainer: {t.TrainerName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
