/**
 * Material 3D Button Component
 * Implements Material Design 3 with ripple effects and 3D transforms
 */

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Button3DProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outlined" | "text";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button3D({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  onClick,
  type = "button",
}: Button3DProps) {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outlined: "btn-outlined",
    text: "btn-text",
  };

  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "text-base py-3 px-6",
    lg: "text-lg py-4 px-8",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {loading ? (
        <div
          className="spinner"
          style={{ width: "20px", height: "20px", borderWidth: "2px" }}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="icon-left">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <span className="icon-right">{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
}

// Made with Bob
