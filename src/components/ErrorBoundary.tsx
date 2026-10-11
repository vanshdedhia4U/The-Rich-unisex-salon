import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Scissors, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-xl bg-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Scissors className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-100">
                The Rich Unisex Salon
              </h2>
              <p className="text-xs text-stone-400 mt-2">
                We encountered an unexpected display issue while loading your experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Website</span>
              </button>
              <button
                onClick={this.handleResetCache}
                className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs border border-stone-700 transition-colors"
              >
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
