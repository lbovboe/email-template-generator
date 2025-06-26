"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { EmailTemplate } from "../../types/email";

interface GeneratedEmailProps {
  email: string;
  template: EmailTemplate | null;
  onStartOver: () => void;
  onEdit: () => void;
}

export const GeneratedEmail: React.FC<GeneratedEmailProps> = ({ email, template, onStartOver, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  // Set the current date on client-side to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  // SAFETY CHECK: If email is a JSON string, extract the actual email content
  let processedEmail = email;
  if (email && typeof email === "string" && email.startsWith("{") && email.includes('"email"')) {
    try {
      const parsed = JSON.parse(email);
      processedEmail = parsed.email || email;
      console.log("🚨 FIXED: Email was a JSON string, extracted content:", processedEmail.substring(0, 100));
    } catch (e) {
      console.error("Failed to parse JSON email content:", e);
      processedEmail = email;
    }
  }

  // Debug logging to help identify content issues
  React.useEffect(() => {
    console.log("GeneratedEmail received email content:", {
      emailLength: processedEmail?.length || 0,
      emailPreview: processedEmail?.substring(0, 200) || "No content",
      template: template?.name || "No template",
      hasContent: !!processedEmail && processedEmail.trim() !== "",
      emailLines: processedEmail ? processedEmail.split("\n").length : 0,
      wasJsonString: email !== processedEmail,
    });
  }, [email, processedEmail, template]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = processedEmail;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([processedEmail], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template?.name.replace(/\s+/g, "_").toLowerCase() || "email"}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseEmailContent = (emailText: string) => {
    if (!emailText || emailText.trim() === "") {
      return { subject: "Generated Email", body: "No content available" };
    }

    const lines = emailText.split("\n");
    let subject = "";
    let body = "";
    let bodyStartIndex = -1;

    // Look for explicit Subject line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.toLowerCase().startsWith("subject:")) {
        subject = line.substring(8).trim(); // Remove "Subject:" prefix
        // Find the start of body content (skip empty lines after subject)
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() !== "") {
            bodyStartIndex = j;
            break;
          }
        }
        break;
      }
    }

    // If no explicit subject found, try to extract from first meaningful line
    if (!subject) {
      const firstMeaningfulLine = lines.find((line) => line.trim() !== "");
      if (firstMeaningfulLine) {
        // If first line is short enough, use it as subject
        if (firstMeaningfulLine.length <= 60) {
          subject = firstMeaningfulLine.trim();
          bodyStartIndex = lines.indexOf(firstMeaningfulLine) + 1;
        } else {
          // Use a generic subject and start body from the beginning
          subject = "Generated Email";
          bodyStartIndex = 0;
        }
      }
    }

    // Extract body content
    if (bodyStartIndex >= 0 && bodyStartIndex < lines.length) {
      body = lines.slice(bodyStartIndex).join("\n").trim();
    } else {
      // Fallback: use all content as body
      body = emailText.trim();
    }

    // Clean up body content
    body = body.replace(/^\n+|\n+$/g, ""); // Remove leading/trailing newlines

    return {
      subject: subject || "Generated Email",
      body: body || "No content available",
    };
  };

  const formatEmailBody = (bodyText: string) => {
    if (!bodyText || bodyText.trim() === "") {
      return <div className="text-gray-500 italic">No email content to display</div>;
    }

    // Split into paragraphs by double newlines, but also handle single newlines
    let paragraphs = bodyText.split(/\n\s*\n/);

    // If no double newlines found, split by single newlines and group logical paragraphs
    if (paragraphs.length === 1) {
      const lines = bodyText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
      paragraphs = [];
      let currentParagraph = "";

      for (const line of lines) {
        // Check if this line starts a new paragraph (greeting, bullet point, etc.)
        const isNewParagraphStart =
          /^(dear|hi|hello|greetings)/i.test(line) ||
          /^(best regards|sincerely|thank you|thanks|best|regards)/i.test(line) ||
          /^[•\-*]/.test(line) ||
          /^\d+\./.test(line) ||
          currentParagraph === "";

        if (isNewParagraphStart && currentParagraph !== "") {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = line;
        } else {
          currentParagraph += (currentParagraph ? " " : "") + line;
        }
      }

      if (currentParagraph) {
        paragraphs.push(currentParagraph.trim());
      }
    }

    return paragraphs
      .map((paragraph, index) => {
        if (!paragraph || paragraph.trim() === "") return null;

        const trimmedParagraph = paragraph.trim();

        // Check content type for styling
        const isGreeting = /^(dear|hello|hi|greetings)/i.test(trimmedParagraph);
        const isClosing = /^(best regards|sincerely|thank you|thanks|best|regards)/i.test(trimmedParagraph);
        const isSignature = index === paragraphs.length - 1 && trimmedParagraph.split("\n").length <= 3;
        const isBulletPoint = /^[•\-*]/.test(trimmedParagraph);
        const isNumberedList = /^\d+\./.test(trimmedParagraph);

        return (
          <div
            key={index}
            className={`
              ${isGreeting ? "text-gray-900 mb-4" : ""}
              ${isClosing || isSignature ? "text-gray-800 mt-6" : ""}
              ${isBulletPoint || isNumberedList ? "ml-8 text-gray-700 mb-2" : ""}
              ${
                !isGreeting && !isClosing && !isSignature && !isBulletPoint && !isNumberedList
                  ? "leading-relaxed text-gray-700 mb-4"
                  : ""
              }
            `}
          >
            {trimmedParagraph.split("\n").map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={lineIndex > 0 ? "mt-1" : ""}
              >
                {line}
              </div>
            ))}
          </div>
        );
      })
      .filter(Boolean);
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = getWordCount(text);
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const { subject, body } = parseEmailContent(processedEmail);

  // Additional validation
  if (!processedEmail || processedEmail.trim() === "") {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg">
          <div className="p-6 text-center">
            <div className="text-yellow-800">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2">No Email Content Available</h3>
              <p className="text-sm">There seems to be an issue with the email generation. Please try again.</p>
            </div>
            <div className="mt-4">
              <Button
                onClick={onStartOver}
                variant="primary"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TEMPORARY DEBUG SECTION */}
      {/* <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h4 className="font-bold text-red-800 mb-2">🐛 DEBUG INFO (Remove this later)</h4>
        <div className="text-sm text-red-700 space-y-1">
          <div>Email length: {processedEmail?.length || 0}</div>
          <div>Has content: {processedEmail && processedEmail.trim() !== "" ? "YES" : "NO"}</div>
          <div>Template: {template?.name || "No template"}</div>
          <div>Subject: &quot;{subject}&quot;</div>
          <div>Body length: {body?.length || 0}</div>
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">Raw email content</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              Original: {email || "No email content"}
              {email !== processedEmail && (
                <>
                  <br />
                  <br />
                  Processed: {processedEmail || "No processed content"}
                </>
              )}
            </pre>
          </details>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Email Generated Successfully!</h2>
                <p className="text-gray-600">Your professional email is ready to use</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Email Statistics */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-purple-600">{getWordCount(processedEmail)}</div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-blue-600">{getCharacterCount(processedEmail)}</div>
              <div className="text-sm text-gray-600">Characters</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-green-600">{getReadingTime(processedEmail)}</div>
              <div className="text-sm text-gray-600">Min Read</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-indigo-600">
                {template?.category ? template.category.charAt(0).toUpperCase() + template.category.slice(1) : "Email"}
              </div>
              <div className="text-sm text-gray-600">Type</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Warning */}
      {/* <div className="bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 mb-2">
                ⚠️ Usage Notice - Portfolio Demo Only
              </h4>
              <div className="text-sm text-amber-700 space-y-1">
                <p>
                  <strong>Important:</strong> This email generator is currently for{" "}
                  <strong>personal portfolio demonstration purposes only</strong>.
                </p>
                <p>• Please avoid daily or excessive usage as each generation incurs API costs</p>
                <p>• Test the functionality briefly and then stop to help keep costs manageable</p>
                <p>• Thank you for being considerate with usage during this demo period! 🙏</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Email Display */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Generated Email
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRawText(!showRawText)}
                className="transition-all duration-200 hover:scale-105"
              >
                {showRawText ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Formatted View
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    Raw Text
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {showRawText ? (
            /* Raw Text View */
            <div className="p-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-green-400 font-mono leading-relaxed pt-6 overflow-x-auto">
                  {processedEmail || "No content available"}
                </pre>
              </div>
            </div>
          ) : (
            /* Formatted Email View */
            <div className="bg-white border-t border-gray-100">
              {/* Email Header */}
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Me</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">From:</span>
                        <span>[Your Name] &lt;your.email@company.com&gt;</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">To:</span>
                        <span>[Recipient Email]</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{currentDate}</div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 leading-tight">{subject}</h2>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="px-6 py-8">
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-4 text-base leading-relaxed">{formatEmailBody(body)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary Actions */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <Button
                onClick={handleCopy}
                variant="primary"
                size="lg"
                className={`relative transition-all duration-200 hover:scale-105 ${
                  copied ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                {copied ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                size="lg"
                className="transition-all duration-200 hover:scale-105"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-4">
              <Button
                onClick={onEdit}
                variant="outline"
                size="lg"
                className="transition-all duration-200 hover:scale-105"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Details
              </Button>

              <Button
                onClick={onStartOver}
                variant="ghost"
                size="lg"
                className="transition-all duration-200 hover:scale-105"
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
                    d="M12 4v1m6 11h1m-6 0a7 7 0 11-7-7 7 7 0 017 7zm-1-7H6.414l1.793-1.793-1.414-1.414L2.586 9l4.207 4.207 1.414-1.414L6.414 10H11z"
                  />
                </svg>
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl animate-bounce">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Pro Tips for Using Your Email</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Review and personalize the email before sending</li>
                <li>• Check all names, dates, and specific details</li>
                <li>• Consider your company&apos;s email signature and formatting</li>
                <li>• Test the tone with your target audience in mind</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
