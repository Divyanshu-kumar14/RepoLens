/**
 * Toast Hook
 * Manages toast notifications
 */

"use client";

import { useState, useCallback } from "react";
import { ToastProps } from "@/components/ui/Toast";

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info",
      duration = 5000,
    ) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastProps = {
        id,
        message,
        type,
        duration,
        onClose: removeToast,
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "success", duration),
    [addToast],
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "error", duration),
    [addToast],
  );

  const info = useCallback(
    (message: string, duration?: number) => addToast(message, "info", duration),
    [addToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      addToast(message, "warning", duration),
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}

// Made with Bob
