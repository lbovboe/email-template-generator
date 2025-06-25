import { EmailTemplate } from "../types/email";

export const emailTemplates: EmailTemplate[] = [
  {
    id: "professional-business",
    name: "Professional Business Email",
    category: "business",
    description: "General purpose professional email template for business communications",
    featured: true,
    tags: ["professional", "business", "formal"],
    systemPrompt: `You are an expert email writer. Write clear, concise emails that:
- Use {tone} language and tone throughout
- Have a clear subject line and purpose
- Include appropriate greetings and closings for a {relationship} relationship
- Are well-structured with proper paragraphs
- Match the {length} requirement
- Adapt your writing style to the {emailType} context
- End with proper signature using the sender's name: {senderName}

Context: Email type is {emailType}, recipient relationship is {relationship}, desired tone is {tone}, target length is {length}
Purpose: {purpose}
Additional context: {additionalContext}
Sender: {senderName}

Write an email to {recipient} following all the above specifications precisely. Include appropriate closing and signature with {senderName}.`,
    variables: [
      {
        name: "recipient",
        label: "Recipient Name",
        type: "text",
        required: true,
        placeholder: "John Smith",
        description: "The name of the person you're emailing",
      },
      {
        name: "senderName",
        label: "Your Name",
        type: "text",
        required: true,
        placeholder: "Jane Doe",
        description: "Your full name for the signature",
      },
      {
        name: "emailType",
        label: "Email Type",
        type: "select",
        required: true,
        options: ["Meeting Request", "Follow-up", "Proposal", "Update", "Introduction", "Request", "Feedback"],
        description: "The type of business email you're sending",
      },
      {
        name: "relationship",
        label: "Relationship",
        type: "select",
        required: true,
        options: ["Colleague", "Manager", "Client", "Vendor", "Partner", "New Contact"],
        description: "Your relationship with the recipient",
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Professional", "Friendly", "Formal", "Casual", "Urgent", "Appreciative"],
        description: "The desired tone for your email",
      },
      {
        name: "length",
        label: "Length",
        type: "select",
        required: true,
        options: ["Brief (1-2 paragraphs)", "Medium (3-4 paragraphs)", "Detailed (5+ paragraphs)"],
        description: "How long should the email be",
      },
      {
        name: "purpose",
        label: "Email Purpose",
        type: "textarea",
        required: true,
        placeholder: "I want to schedule a meeting to discuss the quarterly budget review...",
        description: "The main purpose or goal of this email",
        validation: {
          minLength: 10,
          maxLength: 500,
        },
      },
      {
        name: "additionalContext",
        label: "Additional Context",
        type: "textarea",
        required: false,
        placeholder: "Any additional details, deadlines, or background information...",
        description: "Optional additional context or specific details to include",
        validation: {
          maxLength: 1000,
        },
      },
    ],
  },
  {
    id: "cold-outreach",
    name: "Cold Outreach Email",
    category: "sales",
    description: "Professional cold outreach template for sales and networking",
    featured: true,
    tags: ["sales", "networking", "outreach"],
    systemPrompt: `You are a sales and networking expert. Write a compelling cold outreach email that:
- Opens with a personalized hook related to {companyName} or {recipientRole}
- Clearly states the value proposition: {valueProposition}
- Keeps the tone {tone} and professional
- Includes a clear, specific call-to-action: {callToAction}
- Is concise and respects the recipient's time
- Shows genuine interest in {recipientInterest}
- Mentions {connectionPoint} as a conversation starter

Sender: {senderName}
Company: {senderCompany}
Recipient: {recipientName} at {companyName}

Write a cold outreach email that feels personal and valuable, not salesy.`,
    variables: [
      {
        name: "recipientName",
        label: "Recipient Name",
        type: "text",
        required: true,
        placeholder: "Sarah Johnson",
      },
      {
        name: "recipientRole",
        label: "Recipient Role",
        type: "text",
        required: true,
        placeholder: "Marketing Director",
      },
      {
        name: "companyName",
        label: "Their Company",
        type: "text",
        required: false,
        placeholder: "TechCorp Inc.",
        description: "Optional - leave blank if unknown or not applicable",
      },
      {
        name: "senderName",
        label: "Your Name",
        type: "text",
        required: true,
        placeholder: "Alex Chen",
      },
      {
        name: "senderCompany",
        label: "Your Company",
        type: "text",
        required: true,
        placeholder: "DataSolutions Pro",
      },
      {
        name: "valueProposition",
        label: "Value Proposition",
        type: "textarea",
        required: true,
        placeholder: "We help marketing teams increase lead generation by 40% through automated data analysis...",
        description: "What specific value can you provide to them?",
      },
      {
        name: "connectionPoint",
        label: "Connection Point",
        type: "text",
        required: false,
        placeholder: "I noticed your recent article about marketing automation trends...",
        description: "Something specific about them or their company that caught your attention",
      },
      {
        name: "recipientInterest",
        label: "Their Interests/Challenges",
        type: "text",
        required: false,
        placeholder: "improving lead quality and conversion rates",
        description: "What challenges or interests might they have?",
      },
      {
        name: "callToAction",
        label: "Call to Action",
        type: "select",
        required: true,
        options: [
          "Schedule a 15-minute call",
          "Meet for coffee",
          "Quick demo",
          "Send more information",
          "Connect on LinkedIn",
          "Reply with questions",
        ],
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Professional", "Casual", "Enthusiastic", "Consultative", "Direct"],
      },
    ],
  },
  {
    id: "customer-support",
    name: "Customer Support Response",
    category: "support",
    description: "Professional customer support email template",
    tags: ["support", "customer service", "help"],
    systemPrompt: `You are a helpful customer support representative. Write a professional support email that:
- Acknowledges the customer's {issueType} with empathy
- Uses a {tone} and helpful tone
- Provides clear solutions or next steps for: {solution}
- Includes {timeline} for resolution if applicable
- Offers additional assistance
- Maintains a professional yet caring demeanor

Customer: {customerName}
Issue: {issueDescription}
Priority: {priority}
Support Rep: {supportRepName}

Write a customer support response that resolves their concern effectively.`,
    variables: [
      {
        name: "customerName",
        label: "Customer Name",
        type: "text",
        required: true,
        placeholder: "Michael Davis",
      },
      {
        name: "supportRepName",
        label: "Support Rep Name",
        type: "text",
        required: true,
        placeholder: "Jessica Miller",
      },
      {
        name: "issueType",
        label: "Issue Type",
        type: "select",
        required: true,
        options: [
          "Technical Problem",
          "Billing Question",
          "Product Inquiry",
          "Account Issue",
          "Feature Request",
          "Complaint",
        ],
      },
      {
        name: "issueDescription",
        label: "Issue Description",
        type: "textarea",
        required: true,
        placeholder: "Customer is unable to log into their account after password reset...",
        description: "Detailed description of the customer's issue",
      },
      {
        name: "solution",
        label: "Solution/Next Steps",
        type: "textarea",
        required: true,
        placeholder: "I will reset their password manually and send new login credentials...",
        description: "What solution or next steps will you provide?",
      },
      {
        name: "priority",
        label: "Priority Level",
        type: "select",
        required: true,
        options: ["Low", "Medium", "High", "Urgent"],
      },
      {
        name: "timeline",
        label: "Resolution Timeline",
        type: "select",
        required: false,
        options: ["Within 1 hour", "Within 24 hours", "Within 48 hours", "Within 1 week", "TBD"],
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Empathetic", "Professional", "Apologetic", "Solution-focused", "Reassuring"],
      },
    ],
  },
  {
    id: "job-application",
    name: "Job Application Email",
    category: "personal",
    description: "Professional job application and cover letter email",
    featured: true,
    tags: ["job", "application", "career"],
    systemPrompt: `You are a career expert helping write a compelling job application email. Create an email that:
- Has a clear subject line mentioning the {position} role
- Opens with enthusiasm for the {position} at {companyName}
- Highlights relevant experience: {relevantExperience}
- Showcases key skills: {keySkills}
- Demonstrates knowledge of the company/role: {companyKnowledge}
- Includes a professional call-to-action
- Maintains a {tone} but confident tone
- Mentions attached resume and any other documents

Applicant: {applicantName}
Position: {position}
Company: {companyName}

Write a job application email that stands out and showcases the candidate effectively.`,
    variables: [
      {
        name: "applicantName",
        label: "Your Name",
        type: "text",
        required: true,
        placeholder: "Emily Rodriguez",
      },
      {
        name: "position",
        label: "Position Title",
        type: "text",
        required: true,
        placeholder: "Senior Software Engineer",
      },
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "InnovateTech Solutions",
      },
      {
        name: "relevantExperience",
        label: "Relevant Experience",
        type: "textarea",
        required: true,
        placeholder: "5 years developing full-stack applications using React and Node.js...",
        description: "Your most relevant work experience for this role",
      },
      {
        name: "keySkills",
        label: "Key Skills",
        type: "textarea",
        required: true,
        placeholder: "JavaScript, React, Node.js, AWS, TypeScript, Agile development...",
        description: "Skills that match the job requirements",
      },
      {
        name: "companyKnowledge",
        label: "Company Knowledge",
        type: "textarea",
        required: false,
        placeholder: "I admire your commitment to sustainable technology solutions...",
        description: "What you know/admire about the company or role",
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Professional", "Enthusiastic", "Confident", "Humble", "Passionate"],
      },
    ],
  },
  {
    id: "event-invitation",
    name: "Event Invitation",
    category: "personal",
    description: "Professional or personal event invitation template",
    tags: ["event", "invitation", "meeting"],
    systemPrompt: `You are an event organizer writing an engaging invitation email. Create an email that:
- Has an exciting subject line for the {eventType}: {eventName}
- Clearly states the event details: date {eventDate}, time {eventTime}, location {eventLocation}
- Explains the purpose/benefit: {eventPurpose}
- Uses a {tone} tone appropriate for the audience
- Includes clear RSVP instructions: {rsvpInstructions}
- Mentions any special requirements: {specialRequirements}
- Creates excitement and anticipation for the event

Host: {hostName}
Event: {eventName}
Type: {eventType}

Write an invitation that motivates people to attend and provides all necessary details.`,
    variables: [
      {
        name: "hostName",
        label: "Host Name",
        type: "text",
        required: true,
        placeholder: "Sarah Thompson",
      },
      {
        name: "eventName",
        label: "Event Name",
        type: "text",
        required: true,
        placeholder: "Annual Team Building Retreat",
      },
      {
        name: "eventType",
        label: "Event Type",
        type: "select",
        required: true,
        options: [
          "Business Meeting",
          "Conference",
          "Workshop",
          "Social Event",
          "Celebration",
          "Training",
          "Networking Event",
        ],
      },
      {
        name: "eventDate",
        label: "Event Date",
        type: "text",
        required: true,
        placeholder: "Friday, March 15th, 2024",
      },
      {
        name: "eventTime",
        label: "Event Time",
        type: "text",
        required: true,
        placeholder: "2:00 PM - 6:00 PM PST",
      },
      {
        name: "eventLocation",
        label: "Event Location",
        type: "text",
        required: true,
        placeholder: "Grand Conference Hall, Downtown Convention Center",
      },
      {
        name: "eventPurpose",
        label: "Event Purpose",
        type: "textarea",
        required: true,
        placeholder: "Build stronger team relationships and learn new collaboration techniques...",
        description: "Why should people attend? What will they gain?",
      },
      {
        name: "rsvpInstructions",
        label: "RSVP Instructions",
        type: "text",
        required: true,
        placeholder: "Reply by March 10th or visit our event portal",
      },
      {
        name: "specialRequirements",
        label: "Special Requirements",
        type: "text",
        required: false,
        placeholder: "Business casual attire, bring photo ID",
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Professional", "Exciting", "Formal", "Casual", "Friendly", "Urgent"],
      },
    ],
  },
];

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return emailTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): EmailTemplate[] => {
  return emailTemplates.filter((template) => template.category === category);
};

export const getFeaturedTemplates = (): EmailTemplate[] => {
  return emailTemplates.filter((template) => template.featured);
};

export const searchTemplates = (query: string): EmailTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return emailTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};
