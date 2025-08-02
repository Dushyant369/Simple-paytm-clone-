import { useId } from "react";

export function InputBox({ label, placeholder, onChange, value, type = "text", id }) {
  // Generate a unique ID if not provided for accessibility
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium text-left py-2 block">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </div>
  );
}
