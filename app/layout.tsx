import type { Metadata, Viewport } from "next";
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
  openGraph: {
    title: "AI Email Generator - Professional Email Templates",
    description: "Generate professional emails with AI-powered templates",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
    >
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50`}>
        <div className="relative min-h-screen">
          {/* Header Navigation */}
          <Header />

          {/* Main Content */}
          <main className="relative z-10">{children}</main>

          {/* Footer */}
          <footer className="relative z-10 mt-auto py-8 px-4 border-t border-gray-200/50 backdrop-blur-sm">
            <div className="container-responsive text-center">
              <p className="text-gray-600 text-sm">
                © 2025 AI Email Generator. Powered by advanced language models for professional communication.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
