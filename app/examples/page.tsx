"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../components/ui/Button";

// Sample email examples for each category
const emailExamples = {
  business: [
    {
      id: 1,
      title: "Meeting Request",
      preview:
        "Hi Sarah, I hope this email finds you well. I wanted to reach out to schedule a meeting to discuss our upcoming quarterly review...",
      category: "Business",
      useCase: "Scheduling professional meetings",
      tone: "Professional",
      fullEmail: `Subject: Meeting Request - Q4 Review Discussion

Hi Sarah,

I hope this email finds you well. I wanted to reach out to schedule a meeting to discuss our upcoming quarterly review and align on key priorities for the next quarter.

Would you be available for a 45-minute meeting sometime next week? I'm flexible with timing and can accommodate your schedule. We could meet in person in the conference room or via video call, whichever works better for you.

The main topics I'd like to cover include:
• Q4 performance metrics and achievements
• Budget planning for Q1 2024
• Team resource allocation
• Strategic initiatives timeline

Please let me know your availability, and I'll send out a calendar invitation.

Best regards,
Alex Chen
Project Manager
alex.chen@company.com`,
    },
    {
      id: 2,
      title: "Project Update",
      preview:
        "I wanted to provide you with a quick update on the website redesign project. We've made significant progress over the past week...",
      category: "Business",
      useCase: "Status updates and progress reports",
      tone: "Professional",
      fullEmail: `Subject: Project Update - Website Redesign Progress

Hi Team,

I wanted to provide you with a quick update on the website redesign project. We've made significant progress over the past week and are on track to meet our deadline.

Current Status:
✅ User research and wireframes - Completed
✅ Design mockups - Completed
🔄 Frontend development - 70% complete
⏳ Backend integration - Starting next week
⏳ Testing phase - Scheduled for week of March 15th

Key Achievements:
• Successfully implemented the new navigation structure
• Optimized page load times by 40%
• Completed mobile responsive design for all main pages

Next Steps:
• Complete remaining frontend components
• Begin API integration
• Prepare for user acceptance testing

If you have any questions or concerns, please don't hesitate to reach out.

Best regards,
Jessica Liu
Lead Developer`,
    },
  ],
  sales: [
    {
      id: 3,
      title: "Cold Outreach",
      preview:
        "Hi Michael, I came across your recent LinkedIn post about scaling marketing operations at TechFlow, and it really resonated with me...",
      category: "Sales",
      useCase: "First contact with potential clients",
      tone: "Professional & Personalized",
      fullEmail: `Subject: Helping TechFlow Scale Marketing Operations

Hi Michael,

I came across your recent LinkedIn post about scaling marketing operations at TechFlow, and it really resonated with me. The challenges you mentioned around data integration and lead qualification are exactly what we help companies like yours solve.

I'm Alex from DataSolutions Pro, and we've helped similar SaaS companies increase their lead generation by 40% while reducing manual work by 60%. For example, we recently worked with CloudBase (similar size to TechFlow) to automate their entire lead scoring process, which resulted in:

• 45% increase in qualified leads
• 30% reduction in sales cycle time
• $2M additional revenue in 6 months

I'd love to learn more about TechFlow's specific challenges and see if there's a way we could help. Would you be open to a brief 15-minute call next week? I can share some specific strategies that might be relevant to your situation.

If now isn't the right time, I completely understand. Feel free to keep my contact info for future reference.

Best regards,
Alex Chen
Senior Solutions Consultant
DataSolutions Pro
alex@datasolutionspro.com`,
    },
    {
      id: 4,
      title: "Follow-up Email",
      preview:
        "Thank you for taking the time to speak with me yesterday about TechFlow's marketing automation needs. As promised, I'm following up with...",
      category: "Sales",
      useCase: "Post-meeting follow-up",
      tone: "Professional & Grateful",
      fullEmail: `Subject: Follow-up: Marketing Automation Discussion + Next Steps

Hi Michael,

Thank you for taking the time to speak with me yesterday about TechFlow's marketing automation needs. As promised, I'm following up with the information we discussed and some next steps.

Based on our conversation, here's what I understood about your priorities:
• Streamlining lead qualification process
• Integrating Salesforce with your marketing tools
• Reducing manual data entry for your sales team
• Improving lead-to-customer conversion rates

I've attached a case study from CloudBase that shows exactly how we solved similar challenges. The results were impressive: 40% increase in qualified leads and 25% improvement in conversion rates within 3 months.

Next Steps:
1. I'll prepare a custom proposal based on your specific requirements
2. Our technical team can do a brief assessment of your current setup
3. We can schedule a demo showing the exact features you mentioned

Would next Friday at 2 PM work for a 30-minute demo? I can show you the specific automation workflows that would save your team the most time.

Thanks again for your time, and I look forward to continuing our conversation.

Best regards,
Alex Chen`,
    },
  ],
  support: [
    {
      id: 5,
      title: "Customer Issue Resolution",
      preview:
        "Thank you for contacting our support team regarding the login issues you've been experiencing. I understand how frustrating this must be...",
      category: "Customer Support",
      useCase: "Resolving customer technical issues",
      tone: "Empathetic & Solution-focused",
      fullEmail: `Subject: Login Issue Resolution - Account Restored

Dear Jennifer,

Thank you for contacting our support team regarding the login issues you've been experiencing. I understand how frustrating this must be, especially when you need to access your account for important work.

I've investigated your account and found the root cause of the problem. It appears there was a temporary synchronization issue with our authentication server that affected a small number of accounts, including yours.

Here's what I've done to resolve this:
✅ Reset your account authentication tokens
✅ Verified your account permissions are correct
✅ Tested login functionality - everything is working properly now

You should now be able to log in normally using your existing credentials. If you're still having trouble, please try these steps:
1. Clear your browser cache and cookies
2. Try logging in using an incognito/private browsing window
3. If issues persist, try the "Forgot Password" option to reset your password

I've also applied a one-month service credit to your account as an apology for the inconvenience. You'll see this reflected in your next billing cycle.

Is there anything else I can help you with today? I'm here to ensure you have the best possible experience with our platform.

Best regards,
Marcus Johnson
Senior Customer Success Specialist
support@ourcompany.com
Direct: (555) 123-4567`,
    },
  ],
  personal: [
    {
      id: 6,
      title: "Job Application",
      preview:
        "I am writing to express my strong interest in the Senior Software Engineer position at InnovateTech Solutions...",
      category: "Career",
      useCase: "Job applications and career opportunities",
      tone: "Professional & Enthusiastic",
      fullEmail: `Subject: Application for Senior Software Engineer Position

Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at InnovateTech Solutions. With 5 years of experience developing scalable web applications and a passion for innovative technology solutions, I am excited about the opportunity to contribute to your team.

In my current role at TechCorp, I have:
• Led the development of a microservices architecture that improved system performance by 50%
• Mentored junior developers and established coding best practices across the team
• Successfully delivered 15+ client projects using React, Node.js, and AWS
• Implemented automated testing strategies that reduced bug reports by 60%

What particularly attracts me to InnovateTech Solutions is your commitment to sustainable technology and your recent expansion into AI-powered solutions. I've been following your company's growth and am impressed by the innovative approach you take to solving complex business challenges.

My technical skills include:
• Frontend: React, TypeScript, Next.js, Vue.js
• Backend: Node.js, Python, Express, PostgreSQL
• Cloud: AWS, Docker, Kubernetes
• Tools: Git, Jest, Jenkins, Agile methodologies

I am particularly excited about the opportunity to work on your new AI integration project mentioned in the job posting. My recent experience with machine learning APIs and data processing pipelines would be directly applicable to this initiative.

I have attached my resume and portfolio for your review. I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to InnovateTech Solutions' continued success.

Thank you for your consideration. I look forward to hearing from you.

Best regards,
Emily Rodriguez
emily.rodriguez@email.com
(555) 987-6543
Portfolio: emily-dev.com`,
    },
  ],
};

const categories = [
  { id: "all", name: "All Examples", icon: "📧" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "sales", name: "Sales", icon: "📈" },
  { id: "support", name: "Customer Support", icon: "🎧" },
  { id: "personal", name: "Personal", icon: "👤" },
];

export default function ExamplesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const getFilteredExamples = () => {
    if (activeCategory === "all") {
      return Object.values(emailExamples).flat();
    }
    return emailExamples[activeCategory as keyof typeof emailExamples] || [];
  };

  const filteredExamples = getFilteredExamples();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container-responsive py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Examples</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">See what our AI can create for you</p>
            </div>
            <Link href="/">
              <Button
                variant="secondary"
                size="sm"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              Real AI-Generated Examples
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              See the <span className="gradient-text">Quality</span> for Yourself
            </h2>
            <p
              className="text-xl text-gray-600 dark:text-gray-300 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Explore real examples generated by our AI across different categories and use cases. Every example below
              was created using our intelligent email generator.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12">
        <div className="container-responsive">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ease-out animate-fade-in hover-lift ${
                  activeCategory === category.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
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
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 overflow-hidden animate-fade-in hover-lift cursor-pointer transition-all duration-300 ease-out"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedEmail(example)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                      {example.category}
                    </span>
                    <span className="text-2xl">
                      {categories.find((c) => c.name === example.category)?.icon || "📧"}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{example.title}</h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{example.preview}</p>

                  <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Use Case:</span> {example.useCase}
                    </div>
                    <div>
                      <span className="font-medium">Tone:</span> {example.tone}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Click to view full email</span>
                    <svg
                      className="w-4 h-4 text-purple-600 dark:text-purple-400"
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
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Create Your Own?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            These examples show just a fraction of what our AI can create. Generate your own professional emails in
            seconds.
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEmail.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedEmail.category} • {selectedEmail.tone}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Use Case:</div>
                <div className="text-gray-900 dark:text-white mb-4">{selectedEmail.useCase}</div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tone:</div>
                <div className="text-gray-900 dark:text-white">{selectedEmail.tone}</div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Generated Email:</div>
                <pre className="whitespace-pre-wrap text-gray-900 dark:text-white font-mono text-sm leading-relaxed">
                  {selectedEmail.fullEmail}
                </pre>
              </div>

              <div className="mt-6 flex gap-4">
                <Link href="/generator">
                  <Button className="flex-1">
                    Generate Similar Email
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
