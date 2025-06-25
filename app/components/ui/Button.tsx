import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 hover:shadow-xl shadow-lg hover:from-purple-700 hover:to-blue-700",
    secondary:
      "bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-white/20 hover:scale-105",
    outline:
      "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white hover:scale-105",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    destructive:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-lg",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    className || ""
  }`.trim();

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && <div className="loading-spinner mr-2" />}
      {children}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
      )}
    </button>
  );
};
