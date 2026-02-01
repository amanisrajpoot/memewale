"use client";

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <span className="text-8xl mb-6">💥</span>
                <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
                    Something Went Wrong!
                </h1>
                <p className="text-lg text-[var(--foreground-muted)] mb-8 max-w-md">
                    The meme gods are angry. Don't worry, we're on it!
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="px-6 py-3 border border-[var(--border)] text-[var(--foreground)] font-bold rounded-full hover:bg-[var(--muted)] transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}
