export default function InputField({
  label,
  value = "",
  onChange,
  type = "text",
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      {label && (
        <label className="text-sm font-semibold text-gray-600">{label}</label>
      )}

      <input
        type={type}
        value={value ?? ""} // ✅ absolute safety
        onChange={!disabled ? onChange : undefined}
        readOnly={disabled}
        className={`border p-2 rounded focus:outline-blue-500 
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
