"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
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

  // Load saved form data on component mount
  useEffect(() => {
    const sessionData = sessionStore.get(template.id);
    if (sessionData.formData) {
      setFormData(sessionData.formData);
    }
  }, [template.id]);

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
        return (
          <Select
            key={variable.name}
            value={value}
            onChange={(e) => handleFieldChange(variable, e.target.value)}
            options={(variable.options || []).map((opt) => ({ value: opt, label: opt }))}
            placeholder={variable.placeholder || `Select ${variable.label.toLowerCase()}`}
            {...commonProps}
          />
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Form Progress</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedFields} of {requiredFields} required fields completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Details</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Fill in the information below to customize your email template.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {template.variables.map((variable, index) => (
              <div
                key={variable.name}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl mt-2">{getFieldIcon(variable.type)}</div>
                  <div className="flex-1">{renderField(variable)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setFormData({});
                setErrors({});
                setTouchedFields(new Set());
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              Please complete all required fields to generate your email.
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
