"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TemplateCard } from "../ui/TemplateCard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { EmailTemplate } from "../../types/email";

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  onSelect: (template: EmailTemplate) => void;
  initialCategory?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelect, initialCategory = "all" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    // Update selected category if initialCategory changes
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(templates.map((t) => t.category)));
    return [
      { value: "all", label: "All Categories" },
      ...cats.map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const featuredTemplates = filteredTemplates.filter((t) => t.featured);
  const otherTemplates = filteredTemplates.filter((t) => !t.featured);

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
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              placeholder="Select category"
            />
          </div>
        </div>

        {searchQuery && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="text-2xl mr-2">⭐</span>
            Featured Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onSelect}
                featured
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Templates */}
      {otherTemplates.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onSelect}
                index={index + featuredTemplates.length}
              />
            ))}
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No templates found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search terms or selected category.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
