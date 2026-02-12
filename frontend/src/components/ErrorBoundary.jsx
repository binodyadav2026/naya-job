import React from 'react';
import { Button } from './ui/button';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
                    <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-slate-600 mb-6">
                            The application encountered an unexpected error.
                        </p>

                        <div className="bg-slate-100 p-4 rounded-md overflow-auto max-h-64 mb-6 text-sm font-mono text-slate-800">
                            <p className="font-bold mb-2">{this.state.error?.toString()}</p>
                            <pre>{this.state.errorInfo?.componentStack}</pre>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => window.location.reload()} variant="default">
                                Reload Page
                            </Button>
                            <Button onClick={() => window.location.href = '/'} variant="outline">
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
