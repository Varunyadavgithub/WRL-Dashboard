import { useState } from "react";
import {
  FaUserCheck,
  FaUserTimes,
  FaUsers,
  FaCheckCircle,
  FaPlusCircle,
} from "react-icons/fa";

import Button from "../common/Button";
import { exportToXls } from "../../utils/exportToXls";

export default function AttendanceTab() {
  /* ===============================
     SAMPLE TRAINING DATA (UI ONLY)
     =============================== */
  const trainingInfo = {
    title: "Safety Training – Fire & Electrical",
    date: "12 Mar 2026",
    time: "10:00 AM – 01:00 PM",
  };

  /* ===============================
     EMPLOYEES (ORIGINAL + MANUAL)
     =============================== */
  const [employees, setEmployees] = useState([
    { id: "WRLO0017", name: "Pravin Tambat", department: "Production" },
    { id: "WRLP0005", name: "Kinjal Lad", department: "Quality" },
    { id: "WRLR0051", name: "Namdev Avhad", department: "Maintenance" },
    { id: "WRLS0041", name: "Sabirahmad Shekh", department: "Production" },
  ]);

  /* ===============================
     ATTENDANCE STATE
     =============================== */
  const [attendance, setAttendance] = useState({});
  const [attendanceStarted, setAttendanceStarted] = useState(false);

  /* ===============================
     ADD EMPLOYEE NOT IN LIST
     =============================== */
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: "",
    id: "",
    department: "Production",
    phone: "",
    email: "",
  });

  /* ===============================
     HANDLERS
     =============================== */
  const markPresent = (empId) => {
    setAttendance((prev) => ({ ...prev, [empId]: "PRESENT" }));
  };

  const markAbsent = (empId) => {
    setAttendance((prev) => ({ ...prev, [empId]: "ABSENT" }));
  };

  const presentCount = Object.values(attendance).filter(
    (v) => v === "PRESENT"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (v) => v === "ABSENT"
  ).length;

  /* ===============================
     EXPORT TO EXCEL
     =============================== */
  const handleExportAttendance = () => {
    const exportData = employees.map((emp) => ({
      "Training Title": trainingInfo.title,
      Date: trainingInfo.date,
      "Employee ID": emp.id,
      "Employee Name": emp.name,
      Department: emp.department,
      Status: attendance[emp.id] || "NOT MARKED",
      "Marked On": new Date().toLocaleString(),
    }));

    exportToXls(
      exportData,
      `Training_Attendance_${trainingInfo.date.replaceAll(" ", "_")}.xlsx`
    );
  };

  /* ===============================
     ADD EMPLOYEE HANDLER
     =============================== */
  const addEmployee = () => {
    setEmployees((prev) => [
      ...prev,
      {
        id: newEmp.id,
        name: newEmp.name,
        department: newEmp.department,
        phone: newEmp.phone,
        email: newEmp.email,
        isManual: true,
      },
    ]);

    setNewEmp({
      name: "",
      id: "",
      department: "Production",
      phone: "",
      email: "",
    });

    setShowAddForm(false);
  };

  /* ===============================
     UI
     =============================== */
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="border rounded-xl p-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">
              Training Attendance
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {trainingInfo.date} | {trainingInfo.time}
            </p>
          </div>

          <Button
            bgColor="bg-transparent"
            textColor="text-blue-600"
            padding="px-3 py-1.5"
            borderRadius="rounded-md"
            className="border border-blue-200 hover:bg-blue-50 text-xs"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlusCircle className="inline mr-1" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* ================= ADD EMPLOYEE FORM ================= */}
      {showAddForm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-semibold mb-3">
            Add Employee Not in List
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Employee Name *"
              value={newEmp.name}
              onChange={(e) =>
                setNewEmp({ ...newEmp, name: e.target.value })
              }
              className="border px-3 py-1.5 text-xs rounded"
            />

            <input
              placeholder="Employee Code *"
              value={newEmp.id}
              onChange={(e) =>
                setNewEmp({ ...newEmp, id: e.target.value })
              }
              className="border px-3 py-1.5 text-xs rounded"
            />

            <select
              value={newEmp.department}
              onChange={(e) =>
                setNewEmp({
                  ...newEmp,
                  department: e.target.value,
                })
              }
              className="border px-3 py-1.5 text-xs rounded"
            >
              <option>Production</option>
              <option>Quality</option>
              <option>HR</option>
              <option>Maintenance</option>
            </select>

            <input
              placeholder="Phone (optional)"
              value={newEmp.phone}
              onChange={(e) =>
                setNewEmp({ ...newEmp, phone: e.target.value })
              }
              className="border px-3 py-1.5 text-xs rounded"
            />

            <input
              placeholder="Email (optional)"
              value={newEmp.email}
              onChange={(e) =>
                setNewEmp({ ...newEmp, email: e.target.value })
              }
              className="border px-3 py-1.5 text-xs rounded"
            />
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <Button
              bgColor="bg-transparent"
              textColor="text-gray-600"
              padding="px-3 py-1.5"
              borderRadius="rounded-md"
              className="border text-xs"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>

            <Button
              padding="px-3 py-1.5"
              className="text-xs"
              disabled={!newEmp.name || !newEmp.id}
              onClick={addEmployee}
            >
              Add Employee
            </Button>
          </div>
        </div>
      )}

      {/* ================= START ATTENDANCE ================= */}
      {!attendanceStarted && (
        <div className="border rounded-xl p-5 bg-gray-50 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Attendance has not started yet.
          </p>

          <Button onClick={() => setAttendanceStarted(true)}>
            Start Attendance
          </Button>
        </div>
      )}

      {/* ================= ATTENDANCE PANEL ================= */}
      {attendanceStarted && (
        <>
          {/* SUMMARY */}
          <div className="flex flex-wrap gap-4 border rounded-xl p-4 bg-gray-50">
            <div className="flex items-center gap-2 text-sm">
              <FaUsers />
              Total:
              <span className="font-semibold">
                {employees.length}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <FaUserCheck />
              Present:
              <span className="font-semibold">
                {presentCount}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-red-600">
              <FaUserTimes />
              Absent:
              <span className="font-semibold">
                {absentCount}
              </span>
            </div>
          </div>

          {/* EMPLOYEE LIST */}
          <div className="border rounded-xl divide-y bg-white">
            {employees.map((emp) => {
              const status = attendance[emp.id];

              return (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {emp.name}
                      {emp.isManual && (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                          MANUAL
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {emp.id} | {emp.department}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === "PRESENT" && (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <FaCheckCircle />
                        Present
                      </span>
                    )}

                    {status === "ABSENT" && (
                      <span className="text-red-600 text-sm">
                        Absent
                      </span>
                    )}

                    {!status && (
                      <>
                        <Button
                          bgColor="bg-transparent"
                          textColor="text-green-600"
                          padding="p-2"
                          borderRadius="rounded-full"
                          className="hover:bg-green-100 hover:scale-110"
                          onClick={() => markPresent(emp.id)}
                        >
                          <FaUserCheck className="w-5 h-5" />
                        </Button>

                        <Button
                          bgColor="bg-transparent"
                          textColor="text-red-600"
                          padding="p-2"
                          borderRadius="rounded-full"
                          className="hover:bg-red-100 hover:scale-110"
                          onClick={() => markAbsent(emp.id)}
                        >
                          <FaUserTimes className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-3">
            <Button onClick={handleExportAttendance}>
              Export
            </Button>

            <Button onClick={() => alert("Attendance saved (UI only)")}>
              Save Attendance
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
