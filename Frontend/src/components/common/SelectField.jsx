import React from "react";

const SelectField = ({
  label,
  name, // ✅ added to accept the name prop
  options = [],
  value,
  onChange,
  className = "",
}) => {
  return (
    <div>
      {label && <label className="block font-semibold mb-1">{label}</label>}
      <select
        name={name} // ✅ set the name attribute properly
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md bg-white ${className}`}
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
