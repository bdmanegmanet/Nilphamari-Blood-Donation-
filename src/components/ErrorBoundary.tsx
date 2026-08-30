import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">অ্যাপ্লিকেশন লোড হতে সমস্যা হয়েছে</h2>
              <p className="text-xs text-stone-400">
                ব্রাউজারের ক্যাশ অথবা নেটওয়ার্ক সমস্যার কারণে পেজ লোড বাধাগ্রস্ত হয়েছে।
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-950/80 rounded-xl text-left text-xs font-mono text-red-400 overflow-x-auto max-h-32 border border-stone-800">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-[#B71C1C] hover:bg-[#8B0000] text-white font-bold rounded-xl text-xs transition-colors"
              >
                ক্যাশ রিসেট করে রিলোড দিন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
