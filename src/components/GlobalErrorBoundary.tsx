import * as React from 'react';
import { AlertTriangle, RefreshCw, Home, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getFriendlyErrorMessage } from '../utils/errors';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

export default class GlobalErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[GlobalErrorBoundary] Uncaught React exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev }));
  };

  public render() {
    if (this.state.hasError) {
      const friendlyMessage = getFriendlyErrorMessage(this.state.error);

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-6" id="global-error-boundary-screen">
          <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl overflow-hidden p-8 md:p-10 space-y-8 animate-fade-in">
            
            {/* Header / Icon */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-full border border-rose-100 dark:border-rose-900/40">
                <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="space-y-2">
                <h1 className="font-sans font-bold text-2xl text-slate-900 dark:text-slate-50 tracking-tight">
                  Something went wrong
                </h1>
                <p className="font-sans text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  We encountered an unexpected problem. We have logged the issue and are looking into it.
                </p>
              </div>
            </div>

            {/* Error Message Callout */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 rounded-2xl">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2">
                Message
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {friendlyMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-98 cursor-pointer"
                id="error-reload-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-98 cursor-pointer"
                id="error-home-btn"
              >
                <Home className="w-3.5 h-3.5" />
                Go to Home
              </button>

              <a
                href="/support"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-98 text-center"
                id="error-support-btn"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Get Help
              </a>
            </div>

            {/* Hidden-by-default tech specs details drawer */}
            {this.state.error && (
              <div className="border-t border-slate-100 dark:border-slate-700/50 pt-5">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-left text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                  id="error-details-toggle"
                >
                  <span>Technical Diagnosis</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-xl overflow-x-auto text-[11px] font-mono text-slate-300 leading-normal max-h-48 border border-slate-800 scrollbar-thin">
                    <div className="text-amber-400 font-bold mb-2">Error: {this.state.error.name}</div>
                    <div className="whitespace-pre-wrap">{this.state.error.message}</div>
                    {this.state.error.stack && (
                      <div className="text-slate-500 mt-2 whitespace-pre">
                        {this.state.error.stack.split('\n').slice(0, 10).join('\n')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
