import { useEffect, useState } from "react";
import axios from "axios";

import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";

import { baseURL } from "../../assets/assets";

export default function TrainingDashboard() {
  const [trainings, setTrainings] = useState([]);
  const [filter, setFilter] = useState("UPCOMING");

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const res = await axios.get(`${baseURL}training`);
      setTrainings(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Title text="Training Dashboard" />

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {["UPCOMING", "COMPLETED", "ALL"].map(f => (
          <Button
            key={f}
            text={f}
            onClick={() => setFilter(f)}
            variant={filter === f ? "primary" : "outline"}
          />
        ))}
      </div>

      {/* HR/Admin Create */}
      <div className="mb-4">
        <Button text="+ Create Training" />
      </div>

      {/* Training List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trainings.map(t => (
          <div
            key={t.TrainingID}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <h3 className="font-semibold">{t.TrainingTitle}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(t.StartDateTime).toLocaleString()}
            </p>

            {/* LOCATION */}
            <p className="text-sm mt-2">
              📍 {t.LocationDetails || "TBD"}
            </p>

            <div className="mt-3 flex gap-2">
              <Button
                text="View"
                size="sm"
                onClick={() =>
                  window.location.href = `/training/${t.TrainingID}`
                }
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
