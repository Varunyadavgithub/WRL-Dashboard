const SelectField = ({
  label,
  name,
  options = [],
  value,
  onChange,
  className = "",
}) => {
  return (
    <div>
      {label && <label className="block font-semibold mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-1 border rounded-md bg-white ${className}`}
      >
        <option value="">{label}</option>
        {options
          .filter((opt) => opt && (opt.label || typeof opt === "string"))
          .map((opt, idx) => {
            const optionValue = typeof opt === "string" ? opt : opt.value;
            const optionLabel = typeof opt === "string" ? opt : opt.label;

            return (
              <option key={idx} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default SelectField;
