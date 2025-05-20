import clsx from "clsx";
import React from "react";

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "light" | "solid-border" | "light-border";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  href = "#",
  children,
  variant = "primary",
  className = "",
}) => {
  const baseClasses = "px-5 py-2.5 text-sm font-medium rounded-md shadow-sm";
  const variantClasses = {
    primary: "bg-sky-600 text-white dark:hover:bg-sky-500",
    light:
      "bg-slate-100 text-sky-600 dark:bg-slate-800 dark:text-white dark:hover:text-white/75",
    "solid-border":
      "inline-block border border-sky-600 bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 transition-colors",
    "light-border":
      "inline-block border border-slate-200 px-5 py-3 text-slate-700 dark:text-slate-50 hover:bg-slate-50 hover:text-slate-900 transition-colors",
  };

  return (
    <a
      href={href}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </a>
  );
};

export default Button;
