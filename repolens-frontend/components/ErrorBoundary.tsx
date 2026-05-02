/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

"use client";

import { Component, ReactNode } from "react";
import Card3D from "./ui/Card3D";
import Button3D from "./ui/Button3D";
import ErrorIcon from "@mui/icons-material/Error";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console in development
    console.error("Error caught by boundary:", error, errorInfo);

    // TODO: Send to error reporting service (e.g., Sentry)
    // if (process.env.NODE_ENV === 'production') {
    //   logErrorToService(error, errorInfo);
    // }

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card3D className="max-w-2xl w-full text-center" elevation={3}>
            <div className="flex flex-col items-center gap-6 p-8">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <ErrorIcon className="text-5xl text-red-600 dark:text-red-400" />
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-3">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  We encountered an unexpected error. Don't worry, your data is
                  safe.
                </p>
                {this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Technical details
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-3">
                <Button3D variant="primary" onClick={this.handleReset}>
                  Try Again
                </Button3D>
                <Button3D
                  variant="outlined"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button3D>
              </div>
            </div>
          </Card3D>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Made with Bob
