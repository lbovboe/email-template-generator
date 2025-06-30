"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateSelector } from "../components/generator/TemplateSelector";
import { emailTemplates } from "../data/templates";
import { EmailTemplate } from "../types/email";
import { sessionStore } from "../utils/sessionStorage";

export default function GeneratorPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if there's a pre-selected category from examples page
    const storedCategory = sessionStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
      // Clear the stored category after using it
      sessionStorage.removeItem("selectedCategory");
    }
  }, [isClient]);

  const handleTemplateSelect = (template: EmailTemplate) => {
    // Clear any existing session data for this template
    sessionStore.clear(template.id);

    // Navigate to the form step
    router.push(`/generator/${template.id}`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">AI Email Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional emails in three simple steps: choose a template, fill in details, and generate.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-orange-600 text-white shadow-lg">
                1
              </div>
              <span className="ml-3 font-medium text-orange-600">Select Template</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 mx-4" />
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-gray-200 text-gray-600">
                2
              </div>
              <span className="ml-3 font-medium text-gray-600">Fill Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 mx-4" />
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-gray-200 text-gray-600">
                3
              </div>
              <span className="ml-3 font-medium text-gray-600">Generate Email</span>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="max-w-6xl mx-auto animate-fade-in">
          <TemplateSelector
            templates={emailTemplates}
            onSelect={handleTemplateSelect}
            initialCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
