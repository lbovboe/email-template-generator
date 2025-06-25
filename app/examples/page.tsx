"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { emailExamples, EmailExample } from "../data/examples";

const categories = [
  { name: "All", icon: "🌟" },
  { name: "Business", icon: "💼" },
  { name: "Sales", icon: "💰" },
  { name: "Support", icon: "🛠️" },
  { name: "Marketing", icon: "📈" },
  { name: "Personal", icon: "👤" },
];

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEmail, setSelectedEmail] = useState<EmailExample | null>(null);

  const handleUseTemplate = (example: EmailExample) => {
    // Find the corresponding template ID based on the example
    const templateMapping: { [key: string]: string } = {
      "Follow-up Email": "follow-up",
      "Cold Outreach": "cold-outreach",
      "Meeting Request": "meeting-request",
      "Thank You Note": "thank-you",
      "Product Launch": "product-launch",
      "Customer Support": "customer-support",
    };

    const templateId = templateMapping[example.title] || "general-business";
    window.location.href = `/generator/${templateId}`;
  };

  const filteredExamples =
    selectedCategory === "All"
      ? emailExamples
      : emailExamples.filter(
          (example) => example.category === selectedCategory
        );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container-responsive text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
            Real Examples
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Email <span className="gradient-text">Examples</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Browse through our collection of professionally generated emails to
            see the quality and versatility of our AI-powered templates.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2
                  ${
                    selectedCategory === category.name
                      ? "bg-purple-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="pb-20">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExamples.map((example, index) => (
              <div
                key={example.id}
                className="bg-white rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden animate-fade-in hover-lift cursor-pointer transition-all duration-300 ease-out"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedEmail(example)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {example.category}
                    </span>
                    <span className="text-2xl">
                      {categories.find((c) => c.name === example.category)
                        ?.icon ||
                        (example.category === "Career"
                          ? "👤"
                          : example.category === "Professional Events"
                          ? "🎉"
                          : example.category === "Team Events"
                          ? "🎯"
                          : "📧")}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {example.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {example.preview}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Use Case:</span>{" "}
                      {example.useCase}
                    </div>
                    <div>
                      <span className="font-medium">Tone:</span> {example.tone}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Click to view full email
                    </span>
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container-responsive text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Create Your Own?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            These examples show just a fraction of what our AI can create.
            Generate your own professional emails in seconds.
          </p>
          <Link href="/generator">
            <Button
              variant="secondary"
              size="xl"
              className="text-lg bg-white text-purple-600 hover:bg-gray-100"
            >
              Start Generating Now
              <svg
                className="w-5 h-5 ml-2"
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
          </Link>
        </div>
      </section>

      {/* Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedEmail.title}
                </h3>
                <p className="text-gray-600">
                  {selectedEmail.category} • {selectedEmail.tone}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="text-sm text-gray-600 mb-2">Use Case:</div>
                <div className="text-gray-900 mb-4">
                  {selectedEmail.useCase}
                </div>

                <div className="text-sm text-gray-600 mb-2">Tone:</div>
                <div className="text-gray-900">{selectedEmail.tone}</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-4">
                  Generated Email:
                </div>
                <pre className="whitespace-pre-wrap text-gray-900 font-mono text-sm leading-relaxed">
                  {selectedEmail.fullEmail}
                </pre>
              </div>

              <div className="mt-6 flex gap-4">
                <Button
                  className="flex-1"
                  onClick={() => handleUseTemplate(selectedEmail)}
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
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedEmail.fullEmail);
                    // You could add a toast notification here
                  }}
                >
                  Copy Email
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
