import { useEffect, useState } from "react";

// Format a JS Date object to "YYYY-MM-DD HH:MM:SS" in local time
// const formatDateTimeLocal = (date) => {
//   const pad = (n) => (n < 10 ? "0" + n : n);

//   const year = date.getFullYear();
//   const month = pad(date.getMonth() + 1);
//   const day = pad(date.getDate());
//   const hours = pad(date.getHours());
//   const minutes = pad(date.getMinutes());
//   const seconds = pad(date.getSeconds());

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// };

// Convert "YYYY-MM-DD HH:MM:SS" → "YYYY-MM-DDTHH:MM:SS" for input
const toInputValue = (str) => str?.replace(" ", "T");

// Convert "YYYY-MM-DDTHH:MM:SS" → "YYYY-MM-DD HH:MM:SS"
const fromInputValue = (str) => str?.replace("T", " ");

const DateTimePicker = ({ label, value, onChange, name }) => {
  // const [defaultValue, setDefaultValue] = useState("");

  // useEffect(() => {
  //   const now = new Date();
  //   const formatted = formatDateTimeLocal(now);
  //   setDefaultValue(toInputValue(formatted));
  // }, []);

  return (
    <div>
      {label && <label className="block font-semibold mb-1">{label}</label>}
      <input
        type="datetime-local"
        step="1"
        name={name}
        className="w-full p-1 border rounded-md"
        value={toInputValue(value)}
        onChange={(e) => {
          const raw = e.target.value;
          const formatted = fromInputValue(raw);
          onChange({ target: { name, value: formatted } });
        }}
      />
    </div>
  );
};

export default DateTimePicker;
