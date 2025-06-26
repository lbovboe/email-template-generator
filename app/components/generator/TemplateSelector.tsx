"use client";

import React, { useState, useEffect, useRef } from "react";
import { TemplateCard } from "../ui/TemplateCard";
import { Input } from "../ui/Input";
import { EmailTemplate } from "../../types/email";

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  onSelect: (template: EmailTemplate) => void;
  selectedTemplateId?: string;
  initialCategory?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
  selectedTemplateId,
  initialCategory = "all",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedOption, setFocusedOption] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "business", label: "Business" },
    { value: "personal", label: "Personal" },
    { value: "marketing", label: "Marketing" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
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
    setIsDropdownOpen(!isDropdownOpen);
    setFocusedOption(-1);
  };

  const selectOption = (value: string) => {
    setSelectedCategory(value);
    setIsDropdownOpen(false);
    setFocusedOption(-1);
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isDropdownOpen) {
          toggleDropdown();
        } else if (focusedOption >= 0 && focusedOption < categories.length) {
          selectOption(categories[focusedOption].value);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setFocusedOption(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isDropdownOpen) {
          toggleDropdown();
        } else {
          setFocusedOption(Math.min(focusedOption + 1, categories.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isDropdownOpen) {
          setFocusedOption(Math.max(focusedOption - 1, 0));
        }
        break;
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = filteredTemplates.filter((template) => template.featured).slice(0, 3);
  const regularTemplates = filteredTemplates.filter((template) => !template.featured);

  const selectedCategoryLabel = categories.find((cat) => cat.value === selectedCategory)?.label || "All Categories";

  return (
    <div>
      {/* Header and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="lg:w-64">
            {/* Custom Dropdown */}
            <div
              className="relative w-full"
              ref={dropdownRef}
            >
              {/* Custom Dropdown Trigger */}
              <div
                role="combobox"
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                aria-controls="category-listbox"
                aria-label="Select category"
                tabIndex={0}
                onClick={toggleDropdown}
                onKeyDown={handleDropdownKeyDown}
                className={`
                  relative w-full px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent 
                  bg-white/70 backdrop-blur-sm
                  hover:bg-white/80
                  border-gray-200 hover:border-gray-300
                  text-gray-900 text-lg
                  ${isDropdownOpen ? "ring-2 ring-purple-500/50 border-transparent" : ""}
                `.trim()}
              >
                <div className="flex items-center justify-between">
                  <span className="block truncate">{selectedCategoryLabel}</span>
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
                  id="category-listbox"
                  role="listbox"
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl max-h-60 overflow-auto"
                >
                  {categories.map((category, index) => (
                    <div
                      key={category.value}
                      role="option"
                      aria-selected={category.value === selectedCategory}
                      onClick={() => selectOption(category.value)}
                      className={`
                        px-4 py-3 cursor-pointer transition-all duration-150
                        hover:bg-purple-50
                        ${
                          category.value === selectedCategory
                            ? "bg-purple-100 text-purple-900 font-medium"
                            : "text-gray-900"
                        }
                        ${index === focusedOption ? "bg-purple-50" : ""}
                        ${index === 0 ? "rounded-t-xl" : ""}
                        ${index === categories.length - 1 ? "rounded-b-xl" : ""}
                      `.trim()}
                    >
                      <div className="flex items-center justify-between">
                        <span className="block truncate">{category.label}</span>
                        {category.value === selectedCategory && (
                          <svg
                            className="w-4 h-4 text-purple-600 ml-2"
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
                </div>
              )}
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="text-sm text-gray-600">
            Found {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">⭐</span>
            Featured Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onSelect}
                featured={true}
                index={index}
                className={selectedTemplateId === template.id ? "ring-2 ring-purple-500" : ""}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Templates</h2>
        {regularTemplates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onSelect}
                index={index + featuredTemplates.length}
                className={selectedTemplateId === template.id ? "ring-2 ring-purple-500" : ""}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
