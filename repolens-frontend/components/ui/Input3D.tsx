/**
 * Material 3D Input Component
 * Implements Material Design 3 with floating labels and 3D effects
 */

"use client";

import { motion } from "framer-motion";
import { useState, useId, ChangeEvent, FocusEvent } from "react";

interface Input3DProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function Input3D({
  label,
  error,
  helperText,
  icon,
  fullWidth = false,
  className = "",
  onFocus,
  onBlur,
  ...props
}: Input3DProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const inputId = props.id || id;

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`input-group ${fullWidth ? "w-full" : ""}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <motion.input
          id={inputId}
          className={`input-3d ${icon ? "pl-12" : ""} ${error ? "border-red-500" : ""} ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={`floating-label ${icon ? "left-12" : ""} ${
              error ? "text-red-500" : isFocused ? "text-primary" : ""
            }`}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <motion.p
          className="text-red-500 text-sm mt-1 ml-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1 ml-2">{helperText}</p>
      )}
    </div>
  );
}

// Made with Bob
