"use client";

import React from "react";
import { EmailTemplate } from "../../types/email";
import { Button } from "./Button";

interface TemplateCardProps {
  template: EmailTemplate;
  onSelect: (template: EmailTemplate) => void;
  featured?: boolean;
  index?: number;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  featured = false,
  index = 0,
  className = "",
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      business: "💼",
      personal: "👤",
      marketing: "📈",
      support: "🛠️",
      sales: "💰",
    };
    return icons[category as keyof typeof icons] || "📧";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      business: "bg-blue-100 text-blue-700 border-blue-200",
      personal: "bg-green-100 text-green-700 border-green-200",
      marketing: "bg-purple-100 text-purple-700 border-purple-200",
      support: "bg-orange-100 text-orange-700 border-orange-200",
      sales: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <div
      className={`
        relative group cursor-pointer
        bg-white/80 backdrop-blur-sm
        border border-gray-200/50
        rounded-2xl p-6 shadow-lg
        hover:shadow-2xl hover:shadow-purple-500/10
        hover:-translate-y-2 hover:scale-[1.02]
        transition-all duration-300 ease-out
        animate-fade-in overflow-hidden  flex flex-col
        ${
          featured
            ? "ring-2 ring-purple-500/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50"
            : ""
        }
        ${className}
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onSelect(template)}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-1 right-1 z-10">
          <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-full shadow-lg">
            <span className="mr-1.5">⭐</span>
            Featured
          </div>
        </div>
      )}

      {/* Header with Icon and Title */}
      <div
        className={`flex items-start space-x-4 mb-4 flex-1  ${
          featured ? "mt-2" : ""
        }`}
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-2xl shadow-inner">
            {getCategoryIcon(template.category)}
          </div>
        </div>
        <div className=" min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {template.description}
          </p>
        </div>
      </div>

      {/* Category Badge and Field Count */}
      <div className="flex items-center justify-between mb-4 ">
        <span
          className={`
          px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border
          ${getCategoryColor(template.category)}
          transition-all duration-200
        `}
        >
          {template.category}
        </span>
        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
          {template.variables.length} field
          {template.variables.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {template.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400 bg-gray-50 rounded-md">
              +{template.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(template);
        }}
        className="w-full group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-200 transform group-hover:scale-[1.02]"
        size="sm"
      >
        <span>Use This Template</span>
        <svg
          className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </Button>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
};
