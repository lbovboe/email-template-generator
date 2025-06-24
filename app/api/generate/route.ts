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

    // Replace all variables in the prompt
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      processedPrompt = processedPrompt.replace(new RegExp(placeholder, "g"), value || "");
    });

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
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
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
      model: model || "claude-3-sonnet-20240229",
      max_tokens: 1000,
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

function generateDemoEmail(template: EmailTemplate, variables: Record<string, string>): string {
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
      variables.timeline ? `You can expect a resolution ${variables.timeline.toLowerCase()}.` : ""
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
}
