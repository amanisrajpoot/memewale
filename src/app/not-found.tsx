"use client";

export default function NotFound() {
    return (
        <div className="feed-container" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <span className="text-8xl mb-6">😵</span>
                <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
                    404 - Meme Not Found
                </h1>
                <p className="text-lg text-[var(--foreground-muted)] mb-8 max-w-md">
                    This meme has been lost in the void. Maybe it was too dank for this world.
                </p>
                <a
                    href="/"
                    className="px-6 py-3 bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
}
