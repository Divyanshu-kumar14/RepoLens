/**
 * Material 3D Card Component
 * Implements Material Design 3 with 3D depth and elevation
 */

"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  elevation?: 1 | 2 | 3 | 4 | 5 | 6;
  hoverable?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  variant?: "default" | "glass" | "neumorphic";
}

export default function Card3D({
  children,
  className = "",
  elevation = 2,
  hoverable = true,
  onClick,
  style,
  variant = "default",
}: Card3DProps) {
  const baseClasses = "card-3d";
  const variantClasses = {
    default: "",
    glass: "glass",
    neumorphic: "neumorphic",
  };

  const elevationClass = `elevation-${elevation}`;

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${elevationClass} ${className}`}
      style={style}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={
        hoverable
          ? {
              y: -8,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={hoverable ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}

// Made with Bob
