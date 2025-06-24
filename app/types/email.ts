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

export interface GenerationRequest {
  template: EmailTemplate;
  variables: Record<string, string>;
  provider: string;
  model?: string;
}
