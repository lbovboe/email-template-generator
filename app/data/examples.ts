export interface EmailExample {
  id: number;
  templateId: string;
  title: string;
  preview: string;
  category: string;
  useCase: string;
  tone: string;
  fullEmail: string;
}

export const emailExamples: EmailExample[] = [
  // Professional Business Email Examples
  {
    id: 1,
    templateId: "professional-business",
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
    templateId: "professional-business",
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

  // Cold Outreach Email Examples
  {
    id: 3,
    templateId: "cold-outreach",
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
    templateId: "cold-outreach",
    title: "Follow-up Outreach",
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

  // Customer Support Email Examples
  {
    id: 5,
    templateId: "customer-support",
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
  {
    id: 6,
    templateId: "customer-support",
    title: "Billing Inquiry Response",
    preview:
      "Thank you for reaching out about the billing discrepancy on your recent invoice. I sincerely apologize for any confusion this may have caused...",
    category: "Customer Support",
    useCase: "Billing and account inquiries",
    tone: "Apologetic & Professional",
    fullEmail: `Subject: Billing Inquiry Resolved - Refund Processed

Dear Sarah,

Thank you for reaching out about the billing discrepancy on your recent invoice. I sincerely apologize for any confusion this may have caused, and I appreciate your patience while we investigated this matter.

After reviewing your account thoroughly, I can confirm that there was indeed an error in our billing system that resulted in the double charge you mentioned. This was due to a technical glitch during our recent system update that affected a small number of accounts.

Here's what I've done to resolve this:
✅ Reversed the duplicate charge of $149.99
✅ Issued a full refund to your original payment method
✅ Applied a $25 service credit to your account
✅ Updated your account notes to prevent future issues

The refund should appear in your account within 3-5 business days. You'll also receive an email confirmation shortly with all the details.

To prevent this from happening again, we've implemented additional safeguards in our billing system and will be conducting more thorough testing before any future updates.

If you have any other questions or concerns, please don't hesitate to reach out. We truly value your business and appreciate your understanding.

Best regards,
Lisa Chen
Billing Specialist
billing@ourcompany.com`,
  },

  // Job Application Email Examples
  {
    id: 7,
    templateId: "job-application",
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
  {
    id: 8,
    templateId: "job-application",
    title: "Career Change Application",
    preview:
      "I am excited to apply for the Marketing Manager position at Creative Solutions Agency. While my background is in finance, I am passionate about transitioning into marketing...",
    category: "Career",
    useCase: "Career transition applications",
    tone: "Confident & Strategic",
    fullEmail: `Subject: Marketing Manager Application - Finance Professional Seeking Career Transition

Dear Hiring Manager,

I am excited to apply for the Marketing Manager position at Creative Solutions Agency. While my background is in finance, I am passionate about transitioning into marketing and believe my analytical skills and business acumen make me a unique candidate for this role.

Over the past 6 years in financial analysis, I have developed skills that directly translate to marketing:
• Data analysis and performance metrics interpretation
• Budget planning and ROI optimization
• Cross-functional collaboration with sales and marketing teams
• Client relationship management and strategic planning

To prepare for this career transition, I have:
• Completed Google Analytics and HubSpot Marketing certifications
• Managed social media campaigns for two local nonprofits, increasing engagement by 150%
• Led a rebranding initiative at my current company that improved customer perception scores by 35%
• Taken courses in digital marketing, content strategy, and consumer psychology

What draws me to Creative Solutions Agency is your data-driven approach to creative campaigns. Your recent case study on the TechStart campaign perfectly demonstrates how analytical rigor can enhance creative effectiveness - exactly the intersection where I believe I can excel.

My unique perspective as a finance professional entering marketing means I can:
• Build marketing budgets that align with business objectives
• Implement robust measurement frameworks for campaign performance
• Bridge communication between marketing and finance teams
• Bring a fresh analytical lens to creative strategy

I understand this is a career pivot, but I'm committed to bringing the same dedication and results-oriented mindset that made me successful in finance to marketing. I would love to discuss how my background can bring value to your team.

Thank you for considering my application.

Sincerely,
David Kim
david.kim@email.com
(555) 234-5678`,
  },

  // Event Invitation Email Examples
  {
    id: 9,
    templateId: "event-invitation",
    title: "Corporate Event Invitation",
    preview:
      "You're cordially invited to our Annual Innovation Summit! Join us for an exciting day of networking, learning, and celebrating our achievements...",
    category: "Professional Events",
    useCase: "Corporate events and conferences",
    tone: "Professional & Exciting",
    fullEmail: `Subject: You're Invited: Annual Innovation Summit 2024 - March 15th

Dear Valued Partner,

You're cordially invited to our Annual Innovation Summit! Join us for an exciting day of networking, learning, and celebrating our achievements together.

📅 Date: Friday, March 15th, 2024
🕐 Time: 9:00 AM - 6:00 PM PST
📍 Location: Grand Ballroom, Downtown Convention Center
🎯 Theme: "Building Tomorrow's Solutions Today"

This year's summit will feature:
• Keynote presentations from industry leaders
• Interactive workshops on emerging technologies
• Networking sessions with refreshments
• Awards ceremony recognizing outstanding partnerships
• Live demos of our latest product innovations

Featured speakers include:
• Dr. Sarah Chen, Chief Innovation Officer at TechGlobal
• Michael Rodriguez, Founder of AI Solutions Inc.
• Jennifer Park, VP of Product Strategy at FutureWorks

Whether you're interested in the latest tech trends, want to expand your professional network, or simply celebrate our shared successes, this event promises valuable insights and meaningful connections.

Please RSVP by March 8th through our event portal at summit2024.ourcompany.com or reply to this email. Light breakfast, lunch, and refreshments will be provided throughout the day.

Dress code: Business professional

We're excited to see you there and look forward to an inspiring day together!

Best regards,
Amanda Foster
Event Coordinator
events@ourcompany.com
(555) 789-0123`,
  },
  {
    id: 10,
    templateId: "event-invitation",
    title: "Team Building Event",
    preview:
      "Get ready for an afternoon of fun, collaboration, and team bonding! You're invited to our quarterly team building event at Adventure Park...",
    category: "Team Events",
    useCase: "Team building and internal events",
    tone: "Casual & Enthusiastic",
    fullEmail: `Subject: Team Building Adventure - You're Invited! 🎯

Hey Team,

Get ready for an afternoon of fun, collaboration, and team bonding! You're invited to our quarterly team building event at Adventure Park.

📅 Date: Saturday, April 20th, 2024
🕐 Time: 1:00 PM - 5:00 PM
📍 Location: Adventure Park, 123 Forest Lane
🚗 Transportation: Company shuttle departing at 12:30 PM

What to expect:
• Team-based challenge courses and problem-solving activities
• BBQ lunch and refreshments
• Friendly competitions with prizes
• Photo booth and group pictures
• Relaxed networking time

This is a great opportunity to:
• Strengthen relationships with colleagues from different departments
• Practice collaboration and communication skills in a fun environment
• Take a break from work and recharge your batteries
• Show off your competitive spirit (or just cheer others on!)

What to bring:
• Comfortable clothing and closed-toe shoes
• Positive attitude and team spirit
• Camera for capturing memories

Please RSVP by April 15th so we can plan accordingly. Let us know if you have any dietary restrictions or accessibility needs.

Can't wait to see everyone there and have some fun together!

Cheers,
Mike Thompson
HR Manager
hr@company.com`,
  },
];

export const getExamplesByCategory = (category: string): EmailExample[] => {
  if (category === "all") {
    return emailExamples;
  }

  const categoryMap: { [key: string]: string } = {
    business: "Business",
    sales: "Sales",
    support: "Customer Support",
    personal: "Career",
    events: "Professional Events",
  };

  const targetCategory = categoryMap[category] || category;
  return emailExamples.filter(
    (example) =>
      example.category === targetCategory ||
      (category === "personal" && (example.category === "Career" || example.category === "Team Events"))
  );
};

export const getExampleById = (id: number): EmailExample | undefined => {
  return emailExamples.find((example) => example.id === id);
};

export const getExamplesByTemplateId = (templateId: string): EmailExample[] => {
  return emailExamples.filter((example) => example.templateId === templateId);
};

// Category mapping for navigation
export const categoryMap = {
  Business: "business",
  Sales: "sales",
  "Customer Support": "support",
  Career: "personal",
  "Professional Events": "personal",
  "Team Events": "personal",
};
