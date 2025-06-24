import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Email Generator - Professional Email Templates",
  description:
    "Generate professional emails with AI-powered templates. Create business emails, cold outreach, customer support responses, and more with our intelligent email generator.",
  keywords: ["email generator", "AI email", "email templates", "business emails", "email automation"],
  authors: [{ name: "AI Email Generator" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#6366f1",
  openGraph: {
    title: "AI Email Generator - Professional Email Templates",
    description: "Generate professional emails with AI-powered templates",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
    >
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950`}
      >
        <div className="relative min-h-screen">
          {/* Background decorative elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 opacity-10 blur-3xl animate-pulse" />
            <div
              className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-10 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 opacity-5 blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Header Navigation */}
          <Header />

          {/* Main Content */}
          <main className="relative z-10">{children}</main>

          {/* Footer */}
          <footer className="relative z-10 mt-auto py-8 px-4 border-t border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <div className="container-responsive text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2024 AI Email Generator. Powered by advanced language models for professional communication.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
