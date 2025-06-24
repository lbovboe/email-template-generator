"use client";

import Link from "next/link";
import { Button } from "./components/ui/Button";
import { TemplateCard } from "./components/ui/TemplateCard";
import { getFeaturedTemplates } from "./data/templates";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Generation",
    description: "Leverage advanced language models to create professional, contextually appropriate emails instantly.",
  },
  {
    icon: "📝",
    title: "Smart Templates",
    description: "Choose from expertly crafted templates for business, sales, support, and personal communications.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Generate professional emails in seconds with our optimized prompting engine and intuitive interface.",
  },
  {
    icon: "🎯",
    title: "Contextually Relevant",
    description: "Dynamic variables ensure every email is personalized and appropriate for your specific situation.",
  },
  {
    icon: "🔧",
    title: "Fully Customizable",
    description: "Adjust tone, length, formality, and content to match your communication style perfectly.",
  },
  {
    icon: "💼",
    title: "Professional Quality",
    description: "Every generated email maintains professional standards with proper structure and etiquette.",
  },
];

const stats = [
  { value: "10K+", label: "Emails Generated" },
  { value: "500+", label: "Happy Users" },
  { value: "95%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Available" },
];

export default function HomePage() {
  const featuredTemplates = getFeaturedTemplates();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Email Generation
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Generate <span className="gradient-text">Professional Emails</span> <br className="hidden sm:inline" />
              in Seconds
            </h1>

            <p
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Transform your email communication with AI-powered templates. Create compelling business emails, cold
              outreach, customer support responses, and more with our intelligent email generator.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-scale-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/generator">
                <Button
                  size="xl"
                  className="text-lg"
                >
                  Start Generating Emails
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

              <Button
                variant="secondary"
                size="xl"
                className="text-lg"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View Examples
              </Button>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates Section */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Email Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with our most popular templates, designed for common professional scenarios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(template) => {
                  window.location.href = `/generator?template=${template.id}`;
                }}
                featured={true}
                index={index}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/generator">
              <Button size="lg">
                Browse All Templates
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
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Email Generator?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make your email communication more effective and efficient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center animate-fade-in hover-lift bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 hover:-translate-y-2 transition-all duration-300 ease-out"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container-responsive text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Email Communication?</h2>
          <p className="text-xl lg:text-2xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who use our AI email generator to create compelling, professional emails in
            seconds.
          </p>
          <Link href="/generator">
            <Button
              variant="secondary"
              size="xl"
              className="text-lg bg-white text-purple-600 hover:bg-gray-100"
            >
              Get Started for Free
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
    </div>
  );
}
