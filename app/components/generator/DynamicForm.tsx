"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { EmailTemplate, EmailVariable, FormData } from "../../types/email";
import { sessionStore } from "../../utils/sessionStorage";

interface DynamicFormProps {
  template: EmailTemplate;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ template, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Custom dropdown state
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [focusedOptions, setFocusedOptions] = useState<Record<string, number>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load saved form data on component mount
  useEffect(() => {
    const sessionData = sessionStore.get(template.id);
    if (sessionData.formData) {
      setFormData(sessionData.formData);
    }
  }, [template.id]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      let shouldClose = true;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(dropdownRefs.current).forEach(([_, ref]) => {
        if (ref && ref.contains(target)) {
          shouldClose = false;
        }
      });

      if (shouldClose) {
        setOpenDropdowns({});
        setFocusedOptions({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dropdown helper functions
  const toggleDropdown = (fieldName: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
    setFocusedOptions((prev) => ({
      ...prev,
      [fieldName]: -1,
    }));
  };

  const selectOption = (fieldName: string, value: string, variable: EmailVariable) => {
    handleFieldChange(variable, value);
    setOpenDropdowns((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
    setFocusedOptions((prev) => ({
      ...prev,
      [fieldName]: -1,
    }));
  };

  const handleDropdownKeyDown = (
    e: React.KeyboardEvent,
    fieldName: string,
    variable: EmailVariable,
    options: string[]
  ) => {
    const isOpen = openDropdowns[fieldName];
    const focusedIndex = focusedOptions[fieldName] || -1;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          toggleDropdown(fieldName);
        } else if (focusedIndex >= 0 && focusedIndex < options.length) {
          selectOption(fieldName, options[focusedIndex], variable);
        }
        break;
      case "Escape":
        setOpenDropdowns((prev) => ({ ...prev, [fieldName]: false }));
        setFocusedOptions((prev) => ({ ...prev, [fieldName]: -1 }));
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          toggleDropdown(fieldName);
        } else {
          setFocusedOptions((prev) => ({
            ...prev,
            [fieldName]: Math.min(focusedIndex + 1, options.length - 1),
          }));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedOptions((prev) => ({
            ...prev,
            [fieldName]: Math.max(focusedIndex - 1, 0),
          }));
        }
        break;
    }
  };

  const validateField = (variable: EmailVariable, value: string): string | null => {
    if (variable.required && (!value || (typeof value === "string" && value.trim() === ""))) {
      return `${variable.label} is required`;
    }

    if (variable.validation && typeof value === "string") {
      const { minLength, maxLength, pattern } = variable.validation;

      if (minLength && value.length < minLength) {
        return `${variable.label} must be at least ${minLength} characters`;
      }

      if (maxLength && value.length > maxLength) {
        return `${variable.label} must not exceed ${maxLength} characters`;
      }

      if (pattern && !new RegExp(pattern).test(value)) {
        return `${variable.label} format is invalid`;
      }
    }

    return null;
  };

  const handleFieldChange = (variable: EmailVariable, value: string) => {
    const newFormData = { ...formData, [variable.name]: value };
    setFormData(newFormData);

    // Auto-save to session storage
    sessionStore.save(template.id, { formData: newFormData });

    // Clear error when user starts typing
    if (errors[variable.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[variable.name];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (variable: EmailVariable) => {
    setTouchedFields((prev) => new Set(prev).add(variable.name));

    const value = formData[variable.name];
    const error = validateField(variable, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [variable.name]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    const allTouched = new Set(template.variables.map((v) => v.name));

    template.variables.forEach((variable) => {
      const value = formData[variable.name];
      const error = validateField(variable, value);
      if (error) {
        newErrors[variable.name] = error;
      }
    });

    setTouchedFields(allTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        templateId: template.id,
        variables: formData,
      });
    }
  };

  const renderField = (variable: EmailVariable) => {
    const value = formData[variable.name] || "";
    const error = touchedFields.has(variable.name) ? errors[variable.name] : undefined;
    const isRequired = variable.required;

    const commonProps = {
      label: variable.label + (isRequired ? " *" : ""),
      error,
      helperText: variable.description,
      onBlur: () => handleFieldBlur(variable),
    };

    switch (variable.type) {
      case "text":
        return (
          <Input
            key={variable.name}
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(variable, e.target.value)}
            placeholder={variable.placeholder}
            {...commonProps}
          />
        );

      case "textarea":
        return (
          <Textarea
            key={variable.name}
            value={value}
            onChange={(e) => handleFieldChange(variable, e.target.value)}
            placeholder={variable.placeholder}
            rows={4}
            {...commonProps}
          />
        );

      case "select":
        const selectId = `select-${variable.name}`;
        const isDropdownOpen = openDropdowns[variable.name] || false;
        const focusedIndex = focusedOptions[variable.name] || -1;
        const options = variable.options || [];
        const selectedOption = options.find((opt) => opt === value);
        const displayValue = selectedOption || variable.placeholder || `Select ${variable.label.toLowerCase()}`;

        return (
          <div
            key={variable.name}
            className="relative w-full"
            ref={(el) => {
              dropdownRefs.current[variable.name] = el;
            }}
          >
            {commonProps.label && (
              <label
                htmlFor={selectId}
                className="form-label block text-sm font-medium text-gray-700 mb-2"
              >
                {commonProps.label}
              </label>
            )}

            {/* Custom Dropdown Trigger */}
            <div
              id={selectId}
              role="combobox"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              aria-controls={`${selectId}-listbox`}
              aria-label={commonProps.label}
              tabIndex={0}
              onClick={() => toggleDropdown(variable.name)}
              onKeyDown={(e) => handleDropdownKeyDown(e, variable.name, variable, options)}
              onBlur={commonProps.onBlur}
              className={`
                relative w-full px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer
                                  focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent 
                bg-white/70 
                hover:bg-white/80
                ${commonProps.error ? "border-red-300 bg-red-50/70" : "border-gray-200 hover:border-gray-300"}
                text-gray-900
                                 ${isDropdownOpen ? "ring-2 ring-orange-500/50 border-transparent" : ""}
              `.trim()}
            >
              <div className="flex items-center justify-between">
                <span className={`block truncate ${!selectedOption ? "text-gray-500" : ""}`}>{displayValue}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <div
                id={`${selectId}-listbox`}
                role="listbox"
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white/95 border border-gray-200/50 rounded-xl shadow-xl max-h-60 overflow-auto"
              >
                {options.map((option, index) => (
                  <div
                    key={option}
                    role="option"
                    aria-selected={option === value}
                    onClick={() => selectOption(variable.name, option, variable)}
                    className={`
                      px-4 py-3 cursor-pointer transition-all duration-150
                      hover:bg-orange-50
                                              ${
                                                option === value
                                                  ? "bg-orange-100 text-orange-900 font-medium"
                                                  : "text-gray-900"
                                              }
                                              ${index === focusedIndex ? "bg-orange-50" : ""}
                      ${index === 0 ? "rounded-t-xl" : ""}
                      ${index === options.length - 1 ? "rounded-b-xl" : ""}
                    `.trim()}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block truncate">{option}</span>
                      {option === value && (
                        <svg
                          className="w-4 h-4 text-orange-600 ml-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
                {options.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-center">No options available</div>
                )}
              </div>
            )}

            {commonProps.error && <p className="form-error mt-2 text-sm text-red-600">{commonProps.error}</p>}
            {commonProps.helperText && !commonProps.error && (
              <p className="form-help mt-2 text-sm text-gray-500">{commonProps.helperText}</p>
            )}
          </div>
        );

      case "number":
        return (
          <Input
            key={variable.name}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(variable, e.target.value)}
            placeholder={variable.placeholder}
            {...commonProps}
          />
        );

      case "multiselect":
        // For now, we'll render as text input with comma separation
        const multiselectHelperText = `${variable.description || ""} ${
          variable.description ? "(separate multiple items with commas)" : "Separate multiple items with commas"
        }`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { helperText: _, ...multiselectCommonProps } = commonProps;
        return (
          <Input
            key={variable.name}
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(variable, e.target.value)}
            placeholder={variable.placeholder || "Enter items separated by commas"}
            helperText={multiselectHelperText}
            {...multiselectCommonProps}
          />
        );

      default:
        return null;
    }
  };

  const getFieldIcon = (type: string) => {
    const icons = {
      text: "📝",
      textarea: "📄",
      select: "📋",
      number: "🔢",
      multiselect: "📝",
    };
    return icons[type as keyof typeof icons] || "📝";
  };

  const requiredFields = template.variables.filter((v) => v.required).length;
  const completedFields = template.variables.filter(
    (v) => v.required && formData[v.name] && formData[v.name].toString().trim() !== ""
  ).length;
  const progress = requiredFields > 0 ? (completedFields / requiredFields) * 100 : 100;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Progress Indicator */}
      <div className="bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Form Progress</h3>
            <span className="text-sm text-gray-600">
              {completedFields} of {requiredFields} required fields completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900">Email Details</h3>
          <p className="text-gray-600">Fill in the information below to customize your email template.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-6">
            {template.variables.map((variable) => (
              <div
                key={variable.name}
                className=""
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl mt-2">{getFieldIcon(variable.type)}</div>
                  <div className="flex-1">{renderField(variable)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setFormData({});
                setErrors({});
                setTouchedFields(new Set());
                setOpenDropdowns({});
                setFocusedOptions({});
                sessionStore.save(template.id, { formData: {} });
              }}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Form
            </Button>

            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              disabled={isLoading || progress < 100}
              className="sm:min-w-[200px]"
            >
              {isLoading ? (
                "Generating Email..."
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Email
                </>
              )}
            </Button>
          </div>

          {progress < 100 && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              Please complete all required fields to generate your email.
            </p>
          )}
        </div>
      </div>
    </form>
  );
};
