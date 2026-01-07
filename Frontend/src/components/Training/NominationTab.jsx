import { useMemo, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaUserTie,
  FaSearch,
  FaUserShield,
  FaPlusCircle,
} from "react-icons/fa";

import Button from "../common/Button";

export default function NominationTab({ employees = [] }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");

  /* ===============================
     ADD EMPLOYEE NOT IN LIST
     =============================== */
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualEmployees, setManualEmployees] = useState([]);
  const [manualForm, setManualForm] = useState({
    name: "",
    employee_id: "",
    department: "Production",
    phone: "",
    email: "",
  });

  /* ===============================
     ROLE (SAMPLE)
     =============================== */
  const userRole = "HR"; // HR | ADMIN | HOD | USER
  const hodDepartment = "Production";

  /* ===============================
     SAMPLE BACKEND DATA
     =============================== */
  const alreadyNominated = ["WRLP0005"];

  const hodApprovalMap = {
    WRLO0017: "APPROVED",
    WRLR0051: "PENDING",
  };

  /* ===============================
     FILTERED EMPLOYEES
     =============================== */
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.employee_id.toLowerCase().includes(search.toLowerCase());

      const matchesDept =
        department === "ALL" || e.department === department;

      const hodDeptFilter =
        userRole !== "HOD" || e.department === hodDepartment;

      return matchesSearch && matchesDept && hodDeptFilter;
    });
  }, [employees, search, department, userRole]);

  /* ===============================
     COMBINED LIST
     =============================== */
  const combinedEmployees = useMemo(() => {
    return [
      ...filteredEmployees,
      ...manualEmployees.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) &&
          (department === "ALL" || e.department === department)
      ),
    ];
  }, [filteredEmployees, manualEmployees, search, department]);

  /* ===============================
     TOGGLE SELECTION
     =============================== */
  const toggleEmployee = (empId) => {
    if (alreadyNominated.includes(empId)) return;
    if (userRole === "USER") return;

    setSelected((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  /* ===============================
     SELECT ALL
     =============================== */
  const nominateAll = () => {
    const eligible = combinedEmployees
      .filter((e) => !alreadyNominated.includes(e.employee_id))
      .map((e) => e.employee_id);

    setSelected(
      selected.length === eligible.length ? [] : eligible
    );
  };

  /* ===============================
     SUBMIT
     =============================== */
  const handleSubmit = () => {
    if (userRole === "HOD") {
      alert("Employees approved (sample)");
    } else {
      alert("Nominations sent to HOD (sample)");
    }

    console.log("Selected Employees:", selected);
  };

  return (
    <div className="space-y-5">
      {/* ================= HEADER ================= */}
      <div>
        <h3 className="font-semibold text-base flex items-center gap-2">
          <FaUsers className="text-blue-600" />
          Employee Nomination
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Select employees or add employees not available in the list
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
          <input
            placeholder="Search name / code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border rounded-md text-xs"
          />
        </div>

        {userRole !== "HOD" && (
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-xs bg-white"
          >
            <option value="ALL">All Departments</option>
            <option>Production</option>
            <option>Quality</option>
            <option>HR</option>
            <option>Maintenance</option>
          </select>
        )}

        {["HR", "ADMIN"].includes(userRole) && (
          <Button
            bgColor="bg-transparent"
            textColor="text-purple-600"
            padding="px-3 py-1.5"
            borderRadius="rounded-md"
            className="border border-purple-200 hover:bg-purple-50 text-xs"
            onClick={() => setShowManualForm(true)}
          >
            <FaPlusCircle className="inline mr-1" />
            Add Employee (Not in List)
          </Button>
        )}
      </div>

      {/* ================= ADD EMPLOYEE FORM ================= */}
      {showManualForm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-semibold mb-3">
            Add Employee Not in List
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Employee Name *"
              value={manualForm.name}
              onChange={(e) =>
                setManualForm({ ...manualForm, name: e.target.value })
              }
              className="border px-3 py-1.5 text-xs rounded"
            />

            <input
              placeholder="Employee Code *"
              value={manualForm.employee_id}
              onChange={(e) =>
                setManualForm({
                  ...manualForm,
                  employee_id: e.target.value,
                })
              }
              className="border px-3 py-1.5 text-xs rounded"
            />

            <select
              value={manualForm.department}
              onChange={(e) =>
                setManualForm({
                  ...manualForm,
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
              value={manualForm.phone}
              onChange={(e) =>
                setManualForm({ ...manualForm, phone: e.target.value })
              }
              className="border px-3 py-1.5 text-xs rounded"
            />

            <input
              placeholder="Email (optional)"
              value={manualForm.email}
              onChange={(e) =>
                setManualForm({ ...manualForm, email: e.target.value })
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
              onClick={() => setShowManualForm(false)}
            >
              Cancel
            </Button>

            <Button
              padding="px-3 py-1.5"
              className="text-xs"
              disabled={!manualForm.name || !manualForm.employee_id}
              onClick={() => {
                setManualEmployees((prev) => [
                  ...prev,
                  {
                    ...manualForm,
                    isManual: true,
                  },
                ]);

                setManualForm({
                  name: "",
                  employee_id: "",
                  department: "Production",
                  phone: "",
                  email: "",
                });

                setShowManualForm(false);
              }}
            >
              Add Employee
            </Button>
          </div>
        </div>
      )}

      {/* ================= EMPLOYEE GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {combinedEmployees.map((emp) => {
          const isSelected = selected.includes(emp.employee_id);
          const approval = hodApprovalMap[emp.employee_id];

          return (
            <div
              key={emp.employee_id}
              onClick={() => toggleEmployee(emp.employee_id)}
              className={`border rounded-lg p-3 cursor-pointer
                ${
                  isSelected
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white hover:bg-gray-50"
                }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">{emp.name}</p>
                  <p className="text-xs text-gray-500">
                    {emp.employee_id}
                  </p>

                  <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    {emp.department}
                  </span>

                  {emp.isManual && (
                    <span className="ml-2 text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                      MANUAL
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {isSelected && (
                    <FaCheckCircle className="text-blue-600" />
                  )}

                  {approval && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1
                        ${
                          approval === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      <FaUserShield />
                      {approval}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-end pt-2">
        <Button
          disabled={selected.length === 0}
          onClick={handleSubmit}
        >
          {userRole === "HOD"
            ? "Approve Selected"
            : "Send to HOD"}
        </Button>
      </div>
    </div>
  );
}
