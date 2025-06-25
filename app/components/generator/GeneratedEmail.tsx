"use client";

import React, { useState } from "react";
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([email], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template?.name.replace(/\s+/g, "_").toLowerCase() || "email"}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatEmailForDisplay = (emailText: string) => {
    const lines = emailText.split("\n");
    const formattedLines = lines.map((line, index) => {
      if (line.startsWith("Subject:")) {
        return (
          <div
            key={index}
            className="font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
          >
            {line}
          </div>
        );
      }

      if (line.trim() === "") {
        return (
          <div
            key={index}
            className="h-4"
          />
        );
      }

      return (
        <div
          key={index}
          className="leading-relaxed"
        >
          {line}
        </div>
      );
    });

    return formattedLines;
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

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-2xl shadow-lg backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Generated Successfully!</h2>
                <p className="text-gray-600 dark:text-gray-300">Your professional email is ready to use</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Statistics */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getWordCount(email)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getCharacterCount(email)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getReadingTime(email)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Min Read</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {template?.category ? template.category.charAt(0).toUpperCase() + template.category.slice(1) : "Email"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Display */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Email</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRawText(!showRawText)}
              >
                {showRawText ? "Formatted View" : "Raw Text"}
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {showRawText ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">{email}</pre>
            ) : (
              <div className="text-gray-800 dark:text-gray-200 space-y-2">{formatEmailForDisplay(email)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary Actions */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <Button
                onClick={handleCopy}
                variant="primary"
                size="lg"
                className="relative"
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
      <div className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pro Tips for Using Your Email</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
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
