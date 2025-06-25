import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "floating";
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = "default",
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const baseInputClasses =
    "w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";

  const getInputClasses = (
    variant: string,
    error?: string,
    className?: string
  ) => {
    const errorClasses = error
      ? "border-red-300 bg-red-50"
      : "border-gray-200 bg-white/50 backdrop-blur-sm hover:border-gray-300";

    const variantClasses =
      variant === "floating" ? "peer placeholder-transparent" : "";

    return `${baseInputClasses} ${errorClasses} ${variantClasses} ${
      className || ""
    }`.trim();
  };

  if (variant === "floating") {
    return (
      <div className="form-group">
        <div className="relative">
          <input
            id={inputId}
            className={getInputClasses(variant, error, className)}
            placeholder=" "
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-purple-600 peer-focus:bg-white"
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="form-error">{error}</p>}
        {helperText && !error && <p className="form-help">{helperText}</p>}
      </div>
    );
  }

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={getInputClasses(variant, error, className)}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
      {helperText && !error && <p className="form-help">{helperText}</p>}
    </div>
  );
};
