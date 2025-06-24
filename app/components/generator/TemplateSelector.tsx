"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { EmailTemplate } from "../../types/email";

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  onSelect: (template: EmailTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
      business: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      personal: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      marketing: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      support: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      sales: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

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
                getCategoryIcon={getCategoryIcon}
                getCategoryColor={getCategoryColor}
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
                getCategoryIcon={getCategoryIcon}
                getCategoryColor={getCategoryColor}
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

interface TemplateCardProps {
  template: EmailTemplate;
  onSelect: (template: EmailTemplate) => void;
  featured?: boolean;
  index: number;
  getCategoryIcon: (category: string) => string;
  getCategoryColor: (category: string) => string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  featured = false,
  index,
  getCategoryIcon,
  getCategoryColor,
}) => {
  return (
    <Card
      hover
      className={`relative overflow-hidden animate-fade-in ${
        featured
          ? "ring-2 ring-purple-500/20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10"
          : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {featured && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full">
            <span className="mr-1">⭐</span>
            Featured
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start space-x-3">
          <div className="text-3xl">{getCategoryIcon(template.category)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{template.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{template.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Category Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getCategoryColor(template.category)}`}
            >
              {template.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {template.variables.length} field{template.variables.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                +{template.tags.length - 3}
              </span>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onSelect(template)}
            className="w-full mt-4"
            size="sm"
          >
            Use This Template
            <svg
              className="w-4 h-4 ml-2"
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
        </div>
      </CardContent>
    </Card>
  );
};
