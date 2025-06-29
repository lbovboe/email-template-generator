import React, { useId } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  const baseClasses =
    "w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]";

  const errorClasses = error
    ? "border-red-300 bg-red-50"
    : "border-gray-200 bg-white/50 backdrop-blur-sm hover:border-gray-300";

  const textareaClasses = `${baseClasses} ${errorClasses} ${
    className || ""
  }`.trim();

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
        </label>
      )}
      <textarea id={textareaId} className={textareaClasses} {...props} />
      {error && <p className="form-error">{error}</p>}
      {helperText && !error && <p className="form-help">{helperText}</p>}
    </div>
  );
};
