"use client";

import React, { useState } from "react";
import { TemplateCard } from "../ui/TemplateCard";
import { Input } from "../ui/Input";
import { EmailTemplate } from "../../types/email";

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  onSelectTemplate: (template: EmailTemplate) => void;
  selectedTemplateId?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelectTemplate,
  selectedTemplateId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "business", label: "Business" },
    { value: "personal", label: "Personal" },
    { value: "marketing", label: "Marketing" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = filteredTemplates
    .filter((template) => template.featured)
    .slice(0, 3);
  const regularTemplates = filteredTemplates.filter(
    (template) => !template.featured
  );

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
            <select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedCategory(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent 
                bg-white/70 backdrop-blur-sm
                hover:bg-white/80
                border-gray-200 hover:border-gray-300
                text-gray-900 text-lg"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
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
                onSelect={onSelectTemplate}
                featured={true}
                index={index}
                className={
                  selectedTemplateId === template.id
                    ? "ring-2 ring-purple-500"
                    : ""
                }
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
                onSelect={onSelectTemplate}
                index={index + featuredTemplates.length}
                className={
                  selectedTemplateId === template.id
                    ? "ring-2 ring-purple-500"
                    : ""
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
