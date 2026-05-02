/**
 * Material 3D Loading Spinner Component
 * Animated loading states with Material Design principles
 */

"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  variant = "spinner",
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  const spinnerSize = sizes[size];

  if (variant === "dots") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-blue-600"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
          style={{ width: spinnerSize, height: spinnerSize }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: size === "sm" ? 2 : size === "md" ? 3 : 4,
        }}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}

export function SkeletonLoader({
  width = "100%",
  height = "20px",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card-3d elevation-2 space-y-4">
      <SkeletonLoader height="200px" />
      <SkeletonLoader width="60%" height="24px" />
      <SkeletonLoader width="80%" height="16px" />
      <SkeletonLoader width="40%" height="16px" />
    </div>
  );
}

// Made with Bob
