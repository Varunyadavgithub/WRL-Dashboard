import { useState, useEffect, useRef } from "react";

const SelectField = ({
  label,
  name,
  options = [],
  value,
  onChange,
  className = "",
}) => {
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((opt) => {
        const lbl = typeof opt === "string" ? opt : opt.label;
        return lbl?.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    const selectedValue = typeof opt === "string" ? opt : opt.value;
    onChange({ target: { name, value: selectedValue } });
    setShowOptions(false);
    setSearch("");
  };

  const selectedLabel = (() => {
    const found = options.find((opt) =>
      typeof opt === "string" ? opt === value : opt.value === value
    );
    if (!found) return "";
    return typeof found === "string" ? found : found.label;
  })();

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block font-semibold mb-1">{label}</label>}

      <input
        type="text"
        value={showOptions ? search : selectedLabel}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        className={`w-full p-2 border rounded-md bg-white ${className}`}
        placeholder={`Search ${label?.toLowerCase()}`}
      />

      {showOptions && (
        <ul className="absolute z-50 w-full bg-white border mt-1 max-h-60 overflow-auto rounded-md shadow">
          {filteredOptions.length ? (
            filteredOptions.map((opt, i) => {
              const lbl = typeof opt === "string" ? opt : opt.label;
              return (
                <li
                  key={i}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelect(opt)}
                >
                  {lbl}
                </li>
              );
            })
          ) : (
            <li className="p-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectField;
