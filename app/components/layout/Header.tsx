"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import Image from "next/image";
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Generator", href: "/generator" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getNavLinkClasses = (href: string) => {
    const baseClasses = "relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group";
    const activeClasses = isActive(href) ? "text-orange-600" : "text-gray-600 hover:text-orange-600";

    return `${baseClasses} ${activeClasses}`;
  };

  const getMobileNavLinkClasses = (href: string) => {
    const baseClasses = "block px-4 py-3 rounded-lg font-medium transition-all duration-200";
    const activeClasses = isActive(href)
      ? "text-orange-600 bg-orange-50"
      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50";

    return `${baseClasses} ${activeClasses}`;
  };

  const menuIconClasses = `w-6 h-6 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`;

  const mobileNavClasses = `md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
    isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
  }`;

  return (
    <header className="relative z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/apple-icon.png"
                  alt="AI Email Generator Logo"
                  fill
                  sizes="(max-width: 1024px) 32px, 40px"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300 -z-10" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold gradient-text">AI Email Generator</h1>
              <p className="text-xs lg:text-sm text-gray-500 -mt-1">Professional email templates</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getNavLinkClasses(item.href)}
              >
                {item.name}
                {isActive(item.href) && <div className="absolute inset-0 bg-orange-100 rounded-lg -z-10" />}
                <div className="absolute inset-0 bg-orange-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/generator"
              className={pathname === "/generator" ? "invisible" : ""}
            >
              <Button
                size="md"
                className="shadow-lg"
              >
                Start Generating
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
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className={menuIconClasses}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={mobileNavClasses}>
          <nav className="py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getMobileNavLinkClasses(item.href)}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className={`pt-4 border-t border-gray-200 ${pathname === "/generator" ? "invisible" : ""}`}>
              <Link
                href="/generator"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  size="md"
                  className="w-full"
                >
                  Start Generating
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
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
