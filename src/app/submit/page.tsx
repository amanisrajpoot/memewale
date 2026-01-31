"use client";

import { UploadForm } from "@/components/upload/UploadForm";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Wand2 } from "lucide-react";

export default function SubmitPage() {
    const [caption, setCaption] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        alert("Meme submitted successfully! 🚀");
    };

    return (
        <div className="container max-w-2xl mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                    Submit a Meme
                </h1>
                <p className="mt-2 text-[var(--foreground-muted)]">
                    Share your humor with the world 🌍
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Upload Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-[var(--foreground)]">
                        Upload Image
                    </label>
                    <UploadForm />
                </div>

                {/* Caption Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-[var(--foreground)]">
                        Caption
                    </label>
                    <div className="relative">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write something funny..."
                            className="w-full h-32 p-4 bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)] outline-none resize-none transition-all"
                            required
                        />
                        <button
                            type="button"
                            className="absolute bottom-3 right-3 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors p-2 rounded-lg hover:bg-[var(--muted)]"
                            title="Generate AI Caption"
                        >
                            <Wand2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Settings/Tags could go here */}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => window.history.back()}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-bold hover:opacity-90 transition-opacity"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Posting..." : "Post Meme 🚀"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
