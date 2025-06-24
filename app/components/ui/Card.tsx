import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glassMorphism?: boolean;
  gradient?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glassMorphism = false,
  gradient = false,
  style,
  ...props
}) => {
  const baseClasses = "rounded-2xl transition-all duration-300";

  const getVariantClasses = () => {
    const classes = [];

    if (glassMorphism) {
      classes.push("backdrop-blur-xl bg-white/10 border border-white/20");
    } else if (gradient) {
      classes.push(
        "bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-800/50"
      );
    } else {
      classes.push("bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg");
    }

    if (hover) {
      classes.push("hover:scale-105 hover:shadow-2xl cursor-pointer");
      if (!glassMorphism) {
        classes.push("hover:shadow-purple-500/10");
      }
    }

    return classes.join(" ");
  };

  const cardClasses = `${baseClasses} ${getVariantClasses()} ${className || ""}`.trim();

  return (
    <div
      className={cardClasses}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={`p-6 pb-4 ${className || ""}`.trim()}>{children}</div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className || ""}`.trim()}>{children}</div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={`p-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className || ""}`.trim()}>{children}</div>
);
