"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { TemplateSelector } from "../components/generator/TemplateSelector";
import { DynamicForm } from "../components/generator/DynamicForm";
import { GeneratedEmail } from "../components/generator/GeneratedEmail";
import { emailTemplates, getTemplateById } from "../data/templates";
import { EmailTemplate, FormData } from "../types/email";

function GeneratorPageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_formData, setFormData] = useState<FormData>({ templateId: "", variables: {} });
  const [generatedEmail, setGeneratedEmail] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"select" | "form" | "result">("select");

  // Initialize with template from URL if provided
  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setSelectedTemplate(template);
        setFormData({ templateId: template.id, variables: {} });
        setStep("form");
      }
    }
  }, [templateId]);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({ templateId: template.id, variables: {} });
    setStep("form");
    setGeneratedEmail("");
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: selectedTemplate,
          variables: data.variables,
          provider: "openai", // Default provider for now
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate email");
      }

      const result = await response.text();
      setGeneratedEmail(result);
      setStep("result");
    } catch (error) {
      console.error("Error generating email:", error);
      // For now, we'll show a demo email
      const demoEmail = generateDemoEmail(selectedTemplate, data.variables);
      setGeneratedEmail(demoEmail);
      setStep("result");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDemoEmail = (template: EmailTemplate, variables: Record<string, string>) => {
    // Demo email generation for when API is not available
    const demoEmails = {
      "professional-business": `Subject: ${variables.emailType || "Business Matter"} - ${
        variables.purpose || "Discussion"
      }

Dear ${variables.recipient || "Colleague"},

I hope this email finds you well. I am writing to ${variables.purpose || "discuss an important business matter"}.

${
  variables.additionalContext ? `${variables.additionalContext}\n\n` : ""
}Thank you for your time and consideration. I look forward to your response.

Best regards,
${variables.senderName || "Your Name"}`,

      "cold-outreach": `Subject: ${variables.valueProposition ? "Partnership Opportunity" : "Introduction"} - ${
        variables.senderCompany || "Your Company"
      }

Hi ${variables.recipientName || "Name"},

${variables.connectionPoint ? `${variables.connectionPoint}\n\n` : ""}I'm ${variables.senderName || "Your Name"} from ${
        variables.senderCompany || "Your Company"
      }. ${variables.valueProposition || "I wanted to reach out about a potential opportunity."} 

${
  variables.recipientInterest ? `I believe this could help with ${variables.recipientInterest}.\n\n` : ""
}Would you be interested in ${variables.callToAction || "learning more"}?

Best regards,
${variables.senderName || "Your Name"}`,

      "customer-support": `Subject: Re: ${variables.issueType || "Support Request"} - We're Here to Help

Dear ${variables.customerName || "Valued Customer"},

Thank you for reaching out regarding ${
        variables.issueDescription || "your recent inquiry"
      }. I understand your concern and I'm here to help resolve this matter.

${variables.solution || "I will investigate this issue and provide you with a solution."} ${
        variables.timeline ? `You can expect a resolution ${variables.timeline.toString().toLowerCase()}.` : ""
      }

Please don't hesitate to reach out if you have any questions or need further assistance.

Best regards,
${variables.supportRepName || "Support Team"}`,

      "job-application": `Subject: Application for ${variables.position || "Position"} at ${
        variables.companyName || "Company"
      }

Dear Hiring Manager,

I am writing to express my strong interest in the ${variables.position || "position"} role at ${
        variables.companyName || "your company"
      }. 

${
  variables.relevantExperience || "With my relevant experience"
}, I am confident I would be a valuable addition to your team. My key skills include ${
        variables.keySkills || "various technical and professional competencies"
      }.

${
  variables.companyKnowledge ? `${variables.companyKnowledge}\n\n` : ""
}I have attached my resume for your review and would welcome the opportunity to discuss how I can contribute to your team.

Thank you for your consideration.

Sincerely,
${variables.applicantName || "Your Name"}`,

      "event-invitation": `Subject: You're Invited: ${variables.eventName || "Special Event"} - ${
        variables.eventDate || "Date TBD"
      }

Dear Valued Guest,

You're cordially invited to ${variables.eventName || "our upcoming event"}!

📅 Date: ${variables.eventDate || "TBD"}
🕐 Time: ${variables.eventTime || "TBD"}
📍 Location: ${variables.eventLocation || "TBD"}

${
  variables.eventPurpose || "Join us for an exciting event where you can connect with peers and enjoy great activities."
}

${variables.rsvpInstructions || "Please RSVP by replying to this email."}${
        variables.specialRequirements ? `\n\nPlease note: ${variables.specialRequirements}` : ""
      }

We look forward to seeing you there!

Best regards,
${variables.hostName || "Event Host"}`,
    };

    return (
      demoEmails[template.id as keyof typeof demoEmails] ||
      `Demo email generated for ${template.name} template with your provided variables.`
    );
  };

  const handleStartOver = () => {
    setSelectedTemplate(null);
    setFormData({ templateId: "", variables: {} });
    setGeneratedEmail("");
    setStep("select");
  };

  const handleEditTemplate = () => {
    setStep("form");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">AI Email Generator</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create professional emails in three simple steps: choose a template, fill in details, and generate.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            {[
              { number: 1, label: "Select Template", step: "select" },
              { number: 2, label: "Fill Details", step: "form" },
              { number: 3, label: "Generate Email", step: "result" },
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      step === item.step
                        ? "bg-purple-600 text-white shadow-lg"
                        : step === "result" || (step === "form" && index === 0)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {(step === "result" || (step === "form" && index === 0)) && item.step !== step ? "✓" : item.number}
                  </div>
                  <span
                    className={`ml-3 font-medium ${
                      step === item.step ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {step === "select" && (
            <div className="animate-fade-in">
              <TemplateSelector
                templates={emailTemplates}
                onSelect={handleTemplateSelect}
              />
            </div>
          )}

          {step === "form" && selectedTemplate && (
            <div className="animate-slide-up">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTemplate.name}</h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{selectedTemplate.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleStartOver}
                    >
                      Change Template
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <DynamicForm
                template={selectedTemplate}
                onSubmit={handleFormSubmit}
                isLoading={isGenerating}
              />
            </div>
          )}

          {step === "result" && (
            <div className="animate-scale-in">
              <GeneratedEmail
                email={generatedEmail}
                template={selectedTemplate}
                onStartOver={handleStartOver}
                onEdit={handleEditTemplate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading email generator...</p>
          </div>
        </div>
      }
    >
      <GeneratorPageContent />
    </Suspense>
  );
}
