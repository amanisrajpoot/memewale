import { notFound } from "next/navigation";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[var(--accent-primary)] mb-4">404</h1>
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                    Meme Not Found
                </h2>
                <p className="text-[var(--foreground-muted)] mb-6">
                    This meme doesn't exist or has been removed.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-semibold hover:opacity-90 transition-opacity"
                >
                    Back to Feed
                </a>
            </div>
        </div>
    );
}
