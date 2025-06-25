"use client";

import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  disabled?: boolean;
  id?: string;
  onOpenChange?: (isOpen: boolean, selectId: string) => void;
  zIndex?: number;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  positioning: "below" | "above";
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className,
  value,
  onChange,
  disabled = false,
  id,
  onOpenChange,
  zIndex = 10000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const generatedId = useId();
  const selectId = id || generatedId;
  const dropdownId = `${selectId}-dropdown`;

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Mount check for SSR compatibility
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculateDropdownPosition = useCallback((): DropdownPosition | null => {
    if (!triggerRef.current) return null;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const dropdownHeight = Math.min(240, options.length * 48 + 16); // Approximate dropdown height
    const spaceBelow = viewportHeight - triggerRect.bottom - 8;
    const spaceAbove = triggerRect.top - 8;

    // Determine if dropdown should appear above or below
    const shouldPositionAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    const top = shouldPositionAbove ? triggerRect.top - dropdownHeight - 8 : triggerRect.bottom + 8;

    // Ensure dropdown doesn't go off-screen horizontally
    let left = triggerRect.left;
    const maxLeft = viewportWidth - triggerRect.width - 16;
    if (left > maxLeft) {
      left = maxLeft;
    }

    const maxHeight = shouldPositionAbove ? Math.min(dropdownHeight, spaceAbove) : Math.min(dropdownHeight, spaceBelow);

    return {
      top: Math.max(8, top),
      left: Math.max(8, left),
      width: triggerRect.width,
      maxHeight,
      positioning: shouldPositionAbove ? "above" : "below",
    };
  }, [options.length]);

  const handleOptionSelect = useCallback(
    (option: SelectOption) => {
      onChange?.({ target: { value: option.value } });
      setIsOpen(false);
      setHighlightedIndex(-1);
      onOpenChange?.(false, selectId);
    },
    [onChange, onOpenChange, selectId]
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both trigger and dropdown
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        onOpenChange?.(false, selectId);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOpenChange, selectId]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          onOpenChange?.(false, selectId);
          break;
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            handleOptionSelect(options[highlightedIndex]);
            onOpenChange?.(false, selectId);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, options, handleOptionSelect, onOpenChange, selectId]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const optionElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen) {
      const position = calculateDropdownPosition();
      setDropdownPosition(position);

      // Re-calculate position on window resize/scroll
      const updatePosition = () => {
        const newPosition = calculateDropdownPosition();
        setDropdownPosition(newPosition);
      };

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen, calculateDropdownPosition]);

  const handleTriggerClick = () => {
    if (!disabled) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      setHighlightedIndex(-1);
      onOpenChange?.(newIsOpen, selectId);
    }
  };

  const baseClasses = `relative w-full`;
  const triggerClasses = `
    w-full px-4 py-3 rounded-xl border transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent 
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
    bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
    hover:bg-white/80 dark:hover:bg-gray-800/80
    ${
      error
        ? "border-red-300 bg-red-50/70 dark:bg-red-900/30 dark:border-red-800"
        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
    }
    ${isOpen ? "ring-2 ring-purple-500/50 border-transparent" : ""}
    ${className || ""}
  `.trim();

  // Portal dropdown component
  const DropdownPortal = () => {
    if (!isMounted || !isOpen || !dropdownPosition) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed animate-fade-in"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: zIndex,
          maxHeight: dropdownPosition.maxHeight,
        }}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Options List */}
          <div
            ref={optionsRef}
            id={dropdownId}
            className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            role="listbox"
            style={{
              maxHeight: dropdownPosition.maxHeight - 16, // Account for border/padding
            }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">📋</div>
                <p className="text-sm">No options available</p>
              </div>
            ) : (
              options.map((option, index) => (
                <div
                  key={option.value}
                  className={`
                    px-4 py-3 cursor-pointer transition-all duration-150
                    ${
                      index === highlightedIndex
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-900 dark:text-purple-100"
                        : "hover:bg-gray-50/80 dark:hover:bg-gray-800/80"
                    }
                    ${
                      value === option.value
                        ? "bg-purple-50/80 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
                        : "text-gray-900 dark:text-white"
                    }
                  `}
                  onClick={() => handleOptionSelect(option)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {value === option.value && (
                      <svg
                        className="w-4 h-4 text-purple-600 dark:text-purple-400"
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
              ))
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className={baseClasses}>
      {label && (
        <label
          htmlFor={selectId}
          className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        ref={triggerRef}
        className={triggerClasses}
        onClick={handleTriggerClick}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={dropdownId}
        aria-labelledby={label ? selectId : undefined}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex items-center justify-between">
          <span className={`${selectedOption ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
            {selectedOption ? selectedOption.label : placeholder || "Select an option"}
          </span>
          <div className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
            <svg
              className="w-5 h-5 text-gray-400"
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
      </div>

      {/* Portal-based Dropdown */}
      <DropdownPortal />

      {error && <p className="form-error mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !error && <p className="form-help mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
};
