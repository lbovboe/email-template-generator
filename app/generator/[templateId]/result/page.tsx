"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GeneratedEmail } from "../../../components/generator/GeneratedEmail";
import { getTemplateById } from "../../../data/templates";
import { EmailTemplate } from "../../../types/email";
import { sessionStore } from "../../../utils/sessionStorage";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;

  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const foundTemplate = getTemplateById(templateId);
    if (!foundTemplate) {
      // Redirect to generator home if template not found
      router.replace("/generator");
      return;
    }

    const sessionData = sessionStore.get(templateId);
    if (!sessionData.generatedEmail) {
      // Redirect to form if no generated email found
      router.replace(`/generator/${templateId}`);
      return;
    }

    // DEBUG: Log what we retrieved from session storage
    console.log("=== Result Page Debug ===");
    console.log("Session data retrieved:", sessionData);
    console.log("Generated email content:", sessionData.generatedEmail);
    console.log("Email content length:", sessionData.generatedEmail?.length || 0);
    console.log("Email content preview:", sessionData.generatedEmail?.substring(0, 200) || "No content");
    console.log("Raw email content (showing newlines):", JSON.stringify(sessionData.generatedEmail));

    setTemplate(foundTemplate);
    setGeneratedEmail(sessionData.generatedEmail);
  }, [templateId, router, isClient]);

  const handleStartOver = () => {
    sessionStore.clear(templateId);
    router.push("/generator");
  };

  const handleEdit = () => {
    router.push(`/generator/${templateId}`);
  };

  if (!template || !generatedEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading result...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">AI Email Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your professional email is ready! Review, copy, or make changes as needed.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-green-500 text-white">
                ✓
              </div>
              <span className="ml-3 font-medium text-gray-600">Select Template</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 mx-4" />
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-green-500 text-white">
                ✓
              </div>
              <span className="ml-3 font-medium text-gray-600">Fill Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 mx-4" />
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-orange-600 text-white shadow-lg">
                ✓
              </div>
              <span className="ml-3 font-medium text-orange-600">Generate Email</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto animate-scale-in">
          <GeneratedEmail
            email={generatedEmail}
            template={template}
            onStartOver={handleStartOver}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}
