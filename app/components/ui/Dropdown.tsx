"use client";

import React, { useState, useEffect, useRef } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  theme?: "purple" | "orange";
  onBlur?: () => void;
  "aria-label"?: string;
  id?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  helperText,
  disabled = false,
  className = "",
  theme = "purple",
  onBlur,
  "aria-label": ariaLabel,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedOption, setFocusedOption] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const dropdownId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  // Theme configurations
  const themes = {
    purple: {
      focus: "ring-purple-500/50",
      hover: "hover:bg-purple-50",
      selected: "bg-purple-100 text-purple-900",
      selectedIcon: "text-purple-600",
      focusedOption: "bg-purple-50",
    },
    orange: {
      focus: "ring-orange-500/50",
      hover: "hover:bg-orange-50",
      selected: "bg-orange-100 text-orange-900",
      selectedIcon: "text-orange-600",
      focusedOption: "bg-orange-50",
    },
  };

  const themeConfig = themes[theme];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
        setFocusedOption(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dropdown helper functions
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setFocusedOption(-1);
  };

  const selectOption = (optionValue: string) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
    setFocusedOption(-1);
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          toggleDropdown();
        } else if (focusedOption >= 0 && focusedOption < options.length) {
          selectOption(options[focusedOption].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedOption(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          toggleDropdown();
        } else {
          setFocusedOption(Math.min(focusedOption + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedOption(Math.max(focusedOption - 1, 0));
        }
        break;
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  return (
    <div
      className={`relative w-full ${className}`}
      ref={dropdownRef}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={dropdownId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      {/* Dropdown Trigger */}
      <div
        id={dropdownId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${dropdownId}-listbox`}
        aria-label={ariaLabel || label}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleDropdown}
        onKeyDown={handleDropdownKeyDown}
        onBlur={handleBlur}
        className={`
          relative w-full px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer
          focus:outline-none focus:ring-2 focus:border-transparent 
          bg-white/70 backdrop-blur-sm
          hover:bg-white/80
          ${error ? "border-red-300 bg-red-50/70" : "border-gray-200 hover:border-gray-300"}
          text-gray-900
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${theme === "purple" ? "focus:ring-purple-500/50" : "focus:ring-orange-500/50"}
          ${
            isOpen
              ? theme === "purple"
                ? "ring-2 ring-purple-500/50 border-transparent"
                : "ring-2 ring-orange-500/50 border-transparent"
              : ""
          }
        `.trim()}
      >
        <div className="flex items-center justify-between">
          <span className={`block truncate ${!selectedOption ? "text-gray-500" : ""}`}>{displayValue}</span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          id={`${dropdownId}-listbox`}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl max-h-60 overflow-auto"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => selectOption(option.value)}
              className={`
                px-4 py-3 cursor-pointer transition-all duration-150
                ${themeConfig.hover}
                ${option.value === value ? `${themeConfig.selected} font-medium` : "text-gray-900"}
                ${index === focusedOption ? themeConfig.focusedOption : ""}
                ${index === 0 ? "rounded-t-xl" : ""}
                ${index === options.length - 1 ? "rounded-b-xl" : ""}
              `.trim()}
            >
              <div className="flex items-center justify-between">
                <span className="block truncate">{option.label}</span>
                {option.value === value && (
                  <svg
                    className={`w-4 h-4 ${themeConfig.selectedIcon} ml-2`}
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
          {options.length === 0 && <div className="px-4 py-3 text-gray-500 text-center">No options available</div>}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Helper Text */}
      {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};
