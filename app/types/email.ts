export interface EmailVariable {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "number";
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: "business" | "personal" | "marketing" | "support" | "sales";
  description: string;
  systemPrompt: string;
  variables: EmailVariable[];
  tags: string[];
  featured?: boolean;
}

export interface GeneratedEmail {
  id: string;
  templateId: string;
  content: string;
  subject?: string;
  timestamp: Date;
  variables: Record<string, string>;
}

export interface FormData {
  templateId: string;
  variables: Record<string, string>;
}

export interface LLMProvider {
  id: string;
  name: string;
  apiKeyRequired: boolean;
  supportedModels?: string[];
  defaultModel?: string;
}

// Latest OpenAI model options for email generation
export const OPENAI_MODELS = [
  "gpt-4.1-nano", // Latest: Fastest, cheapest, 1M context, 32K output
  "gpt-4o-mini", // Alternative: Balanced performance/cost
  "gpt-4o", // Alternative: High-quality outputs
  "gpt-3.5-turbo", // Legacy: Basic functionality
] as const;

export const ANTHROPIC_MODELS = [
  "claude-3-5-sonnet-20241022", // Latest Claude model
  "claude-3-sonnet-20240229", // Previous version
  "claude-3-haiku-20240307", // Fast, lightweight option
] as const;

export interface GenerationRequest {
  template: EmailTemplate;
  variables: Record<string, string>;
  provider: string;
  model?: string;
}
