import React, { useId } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  const baseClasses =
    "w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right bg-[length:1rem] bg-[position:right_1rem_center]";

  const errorClasses = error
    ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
    : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-600";

  // Custom dropdown arrow
  const dropdownArrow =
    "bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e')]";

  const selectClasses = `${baseClasses} ${errorClasses} ${dropdownArrow} ${className || ""}`.trim();

  return (
    <div className="form-group">
      {label && (
        <label
          htmlFor={selectId}
          className="form-label"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option
            value=""
            disabled
          >
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
      {helperText && !error && <p className="form-help">{helperText}</p>}
    </div>
  );
};
