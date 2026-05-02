/**
 * Material 3D Toast/Snackbar Component
 * Notification system with Material Design principles
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

export interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({
  id,
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="text-green-500" />,
    error: <ErrorIcon className="text-red-500" />,
    info: <InfoIcon className="text-blue-500" />,
    warning: <WarningIcon className="text-yellow-500" />,
  };

  const bgColors = {
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${bgColors[type]} border-2 rounded-xl p-4 shadow-lg backdrop-blur-sm flex items-start gap-3 min-w-[300px] max-w-[500px]`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
        {message}
      </p>
      <motion.button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Close notification"
      >
        <CloseIcon fontSize="small" />
      </motion.button>
    </motion.div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Made with Bob
