import { NextRequest, NextResponse } from "next/server";
import { GenerationRequest, EmailTemplate } from "../../types/email";

// Environment variables for API keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { template, variables, provider = "openai", model } = body;

    // Validate required fields
    if (!template || !variables) {
      return NextResponse.json({ error: "Template and variables are required" }, { status: 400 });
    }

    // Replace variables in the system prompt
    let processedPrompt = template.systemPrompt;

    console.log("🚀 ~ POST ~ variables:", variables);
    // Replace all variables in the prompt
    Object.entries(variables).forEach(([key, value]) => {
      // Properly escape curly braces for regex pattern
      const placeholder = `\\{${key}\\}`;
      // If value is empty/null/undefined, remove the entire placeholder including braces
      // If value exists, replace placeholder with the actual value
      if (value && value.trim() !== "") {
        processedPrompt = processedPrompt.replace(new RegExp(placeholder, "g"), value);
      } else {
        // Remove the entire placeholder when value is empty
        processedPrompt = processedPrompt.replace(new RegExp(placeholder, "g"), "");
      }
    });

    // Remove any remaining placeholders that don't have corresponding variables
    processedPrompt = processedPrompt.replace(/\{[^}]+\}/g, "");

    // Generate email based on provider
    let generatedEmail: string;

    if (provider === "openai" && OPENAI_API_KEY) {
      generatedEmail = await generateWithOpenAI(processedPrompt, model);
    } else if (provider === "anthropic" && ANTHROPIC_API_KEY) {
      generatedEmail = await generateWithAnthropic(processedPrompt, model);
    } else {
      // Fallback to demo generation
      generatedEmail = generateDemoEmail(template, variables);
    }

    return NextResponse.json({ email: generatedEmail });
  } catch (error) {
    console.error("Email generation error:", error);
    return NextResponse.json({ error: "Failed to generate email. Please try again." }, { status: 500 });
  }
}

async function generateWithOpenAI(prompt: string, model?: string): Promise<string> {
  console.log("🚀 ~ generateWithOpenAI ~ prompt:", prompt);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // GPT-4.1 Nano: Fastest and cheapest model in GPT-4.1 series
      // Optimized for low-latency tasks like email generation
      // 1M context window, 32K max output, $0.10/M input + $0.40/M output
      model: model || "gpt-4.1-nano",

      // OpenAI Chat Completions API - Message Roles:
      // "system" - Sets AI behavior/personality/instructions (optional)
      //           Example: "You are a professional email writer..."
      // "user"   - Human input/requests (what user wants AI to do)
      //           Example: "Write a follow-up email about our meeting"
      // "assistant" - AI's previous responses (for multi-turn conversations)
      //              Example: Used to maintain conversation context
      //
      // Current implementation uses single-turn with "user" role only
      // since our prompt already contains complete instructions + data
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      // Increased from 1000 to leverage GPT-4.1 nano's 32K output capability
      max_tokens: 4000,
      // Slightly lower temperature for more consistent email generation
      temperature: 0.6,
      // n: 1 (default) - Only generate 1 response choice for optimal token usage
      // Setting n > 1 would multiply output token costs by n
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("🚀 ~ generateWithOpenAI ~ data:", data);

  // OpenAI API Response Structure:
  // {
  //   "choices": [                    // Array of possible responses
  //     {
  //       "index": 0,                 // Position in array (usually 0)
  //       "message": {
  //         "role": "assistant",      // AI's response role
  //         "content": "Generated text here..."  // The actual AI response
  //       },
  //       "finish_reason": "stop"     // Why generation ended
  //     }
  //   ],
  //   "usage": { ... },              // Token usage info
  //   "id": "chatcmpl-...",         // Request ID
  //   "model": "gpt-4.1-nano"       // Model used
  // }
  //
  // We access choices[0] because:
  // - OpenAI can generate multiple responses (n parameter)
  // - We only request 1 response, so it's always at index [0]
  // - ?. is optional chaining for safety (prevents crashes if missing)
  return data.choices[0]?.message?.content || "Failed to generate email content.";
}

async function generateWithAnthropic(prompt: string, model?: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY!,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      // Updated to latest Claude model for better performance
      model: model || "claude-3-5-sonnet-20241022",
      // Increased max_tokens to match GPT-4.1 nano capabilities
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "Failed to generate email content.";
}

function generateColdOutreachDemo(variables: Record<string, string>): string {
  const outreachType = variables.outreachType || "Customer";
  const recipientName = variables.recipientName || "Name";
  const senderName = variables.senderName || "Your Name";
  const senderCompany = variables.senderCompany || "Your Company";
  const companyName = variables.companyName || "Their Company";
  const recipientRole = variables.recipientRole || "Their Role";
  const connectionPoint = variables.connectionPoint || "I came across your profile";
  const credibilityBuilder = variables.credibilityBuilder || "We have helped many companies";
  const valueProposition = variables.valueProposition || "We offer innovative solutions";
  const industryContext = variables.industryContext || "your industry";
  const recipientInterest = variables.recipientInterest || "";
  const callToAction = variables.callToAction || "Schedule a 15-minute call";

  // Generate subject line based on outreach type
  const subjectLines = {
    Customer: `${valueProposition.split(".")[0]} - ${senderCompany}`,
    Partner: `Partnership Opportunity - ${senderCompany} x ${companyName}`,
    Investor: `Investment Opportunity - ${senderCompany}`,
    "Professional Contact": `Introduction from ${senderName} - ${senderCompany}`,
  };

  // Generate opening based on outreach type
  const openings = {
    Customer: `Hi ${recipientName},\n\n${connectionPoint}. As the ${recipientRole} at ${companyName}, I thought you'd be interested in how ${credibilityBuilder.toLowerCase()}.`,
    Partner: `Hi ${recipientName},\n\n${connectionPoint}. I believe there's a strong synergy between ${senderCompany} and ${companyName} that could benefit both our organizations.`,
    Investor: `Hi ${recipientName},\n\n${connectionPoint}. Given your expertise in ${industryContext}, I wanted to share an exciting investment opportunity with ${senderCompany}.`,
    "Professional Contact": `Hi ${recipientName},\n\n${connectionPoint}. I've been following your work in ${industryContext} and would love to connect and learn from your experience.`,
  };

  // Generate main content based on outreach type
  const content = {
    Customer: `${valueProposition}\n\n${credibilityBuilder}, and I believe we could deliver similar results for ${companyName}.${
      recipientInterest ? ` Given your focus on ${recipientInterest}, this seems particularly relevant.` : ""
    }`,
    Partner: `${valueProposition}\n\nBased on ${credibilityBuilder}, I see great potential for a strategic partnership.${
      recipientInterest
        ? ` Particularly around ${recipientInterest}, where our capabilities complement each other.`
        : ""
    }`,
    Investor: `${valueProposition}\n\nOur traction includes: ${credibilityBuilder}. The market opportunity in ${industryContext} is significant and growing rapidly.${
      recipientInterest ? ` Your experience with ${recipientInterest} would be invaluable as we scale.` : ""
    }`,
    "Professional Contact": `I'm always eager to connect with thought leaders in ${industryContext}. ${credibilityBuilder}, and I'd love to share insights and learn from your experience.${
      recipientInterest ? ` I'm particularly interested in your perspective on ${recipientInterest}.` : ""
    }`,
  };

  // Generate call to action
  const callToActionText = {
    "Schedule a 15-minute call": "Would you be available for a brief 15-minute call next week?",
    "Brief 20-minute demo": "I'd love to show you a quick 20-minute demo of how this works.",
    "Coffee meeting": "Would you be interested in meeting for coffee to discuss this further?",
    "Send detailed proposal": "I can send you a detailed proposal outlining the specifics.",
    "Connect on LinkedIn": "I'd love to connect with you on LinkedIn to continue the conversation.",
    "Share case study": "I can share a relevant case study that demonstrates the results we've achieved.",
    "Quick product tour": "Would you like a quick product tour to see how this could work for you?",
    "Exploratory conversation": "Would you be open to an exploratory conversation about potential opportunities?",
  };

  return `Subject: ${subjectLines[outreachType as keyof typeof subjectLines]}

${openings[outreachType as keyof typeof openings]}

${content[outreachType as keyof typeof content]}

${callToActionText[callToAction as keyof typeof callToActionText] || "Would you be interested in learning more?"}

Best regards,
${senderName}
${senderCompany}`;
}

function generateDemoEmail(template: EmailTemplate, variables: Record<string, string>): string {
  // Demo email generation for when API is not available
  const demoEmails = {
    "professional-business": `Subject: ${variables.emailType || "Business Communication"} - ${
      variables.purpose || "Important Matter"
    }

Dear ${variables.recipient || "Colleague"},

I hope this email finds you well. I am writing regarding ${variables.purpose || "an important business matter"}.

${variables.additionalContext ? `${variables.additionalContext}\n\n` : ""}Based on our ${
      variables.relationship?.toLowerCase() || "professional"
    } relationship, I wanted to reach out with a ${
      variables.tone?.toLowerCase() || "professional"
    } approach to discuss this matter.

Thank you for your time and consideration. I look forward to your response.

Best regards,
${variables.senderName || "Your Name"}`,

    "cold-outreach": generateColdOutreachDemo(variables),

    "customer-support": `Subject: Re: ${variables.issueType || "Support Request"} - Resolution Update

Dear ${variables.customerName || "Valued Customer"},

Thank you for contacting our support team regarding ${
      variables.issueDescription || "your recent inquiry"
    }. I understand how ${
      variables.priority === "High" || variables.priority === "Urgent" ? "urgent" : "important"
    } this matter is to you.

${variables.solution || "I have investigated your issue and will provide you with a solution."} ${
      variables.timeline ? `You can expect a resolution ${variables.timeline.toLowerCase()}.` : ""
    }

${
  variables.priority === "High" || variables.priority === "Urgent"
    ? "Given the urgency of this matter, I will personally monitor the progress and keep you updated."
    : "I will keep you informed of any updates throughout the resolution process."
}

Please don't hesitate to reach out if you have any questions or need further assistance.

Best regards,
${variables.supportRepName || "Support Team"}
Customer Support Specialist`,

    "job-application": `Subject: Application for ${variables.position || "Position"} at ${
      variables.companyName || "Your Company"
    }

Dear Hiring Manager,

I am writing to express my ${
      variables.tone?.toLowerCase().includes("enthusiastic") ? "strong enthusiasm" : "interest"
    } in the ${variables.position || "position"} role at ${variables.companyName || "your company"}. 

${
  variables.relevantExperience || "With my relevant professional experience"
}, I am confident I would be a valuable addition to your team. My key skills include ${
      variables.keySkills || "various technical and professional competencies"
    }.

${
  variables.companyKnowledge ? `${variables.companyKnowledge}\n\n` : ""
}I am particularly drawn to this opportunity because it aligns perfectly with my career goals and passion for ${
      variables.position?.toLowerCase().includes("engineer")
        ? "technology and innovation"
        : variables.position?.toLowerCase().includes("marketing")
        ? "creative problem-solving and data-driven strategies"
        : variables.position?.toLowerCase().includes("manager")
        ? "leadership and strategic planning"
        : "professional growth and excellence"
    }.

I have attached my resume for your review and would welcome the opportunity to discuss how my experience and ${
      variables.tone?.toLowerCase().includes("enthusiastic") ? "enthusiasm" : "skills"
    } can contribute to your team's success.

Thank you for your consideration. I look forward to hearing from you.

${variables.tone?.toLowerCase().includes("formal") ? "Sincerely" : "Best regards"},
${variables.applicantName || "Your Name"}`,

    "event-invitation": `Subject: You're Invited: ${variables.eventName || "Special Event"} - ${
      variables.eventDate || "Date TBD"
    }

Dear Guest,

${
  variables.tone?.toLowerCase().includes("exciting") ? "We're thrilled to invite you" : "You're cordially invited"
} to ${variables.eventName || "our upcoming event"}!

📅 Date: ${variables.eventDate || "TBD"}
🕐 Time: ${variables.eventTime || "TBD"}  
📍 Location: ${variables.eventLocation || "TBD"}
${variables.eventType ? `🎯 Event Type: ${variables.eventType}` : ""}

${
  variables.eventPurpose ||
  "Join us for an exciting event where you can connect with others and enjoy great activities."
}

${variables.rsvpInstructions || "Please RSVP by replying to this email or contacting us directly."}${
      variables.specialRequirements ? `\n\nPlease note: ${variables.specialRequirements}` : ""
    }

${
  variables.tone?.toLowerCase().includes("casual") || variables.tone?.toLowerCase().includes("friendly")
    ? "Can't wait to see you there!"
    : "We look forward to your attendance."
}

${variables.tone?.toLowerCase().includes("formal") ? "Sincerely" : "Best regards"},
${variables.hostName || "Event Host"}`,
  };

  return (
    demoEmails[template.id as keyof typeof demoEmails] ||
    `Demo email generated for ${template.name} template with your provided variables.`
  );
}
