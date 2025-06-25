export interface SessionData {
  formData?: Record<string, string>;
  generatedEmail?: string;
  templateId?: string;
}

const SESSION_KEY = "email-generator-session";

export const sessionStore = {
  save: (templateId: string, data: Partial<SessionData>) => {
    if (typeof window === "undefined") return;

    const existing = sessionStore.get(templateId);
    const updated = { ...existing, ...data, templateId };

    // DEBUG: Log what we're trying to save
    if (data.generatedEmail) {
      console.log("=== Session Storage Save Debug ===");
      console.log("Saving email content length:", data.generatedEmail.length);
      console.log("Email content preview:", data.generatedEmail.substring(0, 100));
      console.log("Is JSON string?", data.generatedEmail.startsWith("{") && data.generatedEmail.includes('"email"'));
    }

    try {
      window.sessionStorage.setItem(`${SESSION_KEY}-${templateId}`, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save to session storage:", error);
    }
  },

  get: (templateId: string): SessionData => {
    if (typeof window === "undefined") return {};

    try {
      const data = window.sessionStorage.getItem(`${SESSION_KEY}-${templateId}`);
      const parsed = data ? JSON.parse(data) : {};

      // DEBUG: Log what we retrieved
      if (parsed.generatedEmail) {
        console.log("=== Session Storage Get Debug ===");
        console.log("Retrieved email content length:", parsed.generatedEmail.length);
        console.log("Email content preview:", parsed.generatedEmail.substring(0, 100));
        console.log(
          "Is JSON string?",
          parsed.generatedEmail.startsWith("{") && parsed.generatedEmail.includes('"email"')
        );
      }

      return parsed;
    } catch (error) {
      console.error("Failed to read from session storage:", error);
      return {};
    }
  },

  clear: (templateId?: string) => {
    if (typeof window === "undefined") return;

    try {
      if (templateId) {
        window.sessionStorage.removeItem(`${SESSION_KEY}-${templateId}`);
      } else {
        // Clear all email generator sessions
        const keys = Object.keys(window.sessionStorage);
        keys.forEach((key) => {
          if (key.startsWith(SESSION_KEY)) {
            window.sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error("Failed to clear session storage:", error);
    }
  },
};
