import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-300 mb-6">
              We encountered an unexpected error. Don't worry, it's not your fault.
            </p>
            
            {this.state.error && (
              <details className="text-left mb-6">
                <summary className="text-sm text-gray-400 cursor-pointer mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-red-300 bg-black/20 p-3 rounded-lg overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                icon={<RefreshCw className="w-4 h-4" />}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
                className="w-full"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;