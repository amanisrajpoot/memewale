"use client";

import { UploadForm } from "@/components/upload/UploadForm";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { generateShortId } from "@/lib/shortId";

export default function SubmitPage() {
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { addToast } = useToast();
    const { user } = useAuthStore();
    const router = useRouter();
    const supabase = createClient();

    // Protect route
    useEffect(() => {
        if (!user) {
            // Optional: Redirect or just show message. Usually Middleware handles this, 
            // but client-side check is good UX.
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            addToast("You must be logged in to post memes!", "error");
            router.push("/login");
            return;
        }

        if (!file) {
            addToast("Please upload an image!", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload Image to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('memes')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('memes')
                .getPublicUrl(fileName);

            // Determine Media Type
            let mediaType = "image";
            if (file.type.startsWith("video/")) {
                mediaType = "video";
            } else if (file.type === "image/gif") {
                mediaType = "gif";
            }

            // 3. Insert into Memes table
            const { error: dbError } = await supabase
                .from('memes')
                .insert({
                    author_id: user.id,
                    short_id: generateShortId(),
                    media_url: publicUrl,
                    media_type: mediaType,
                    caption: caption,
                    metadata: { width: 0, height: 0 }
                });

            if (dbError) throw dbError;

            addToast("Meme submitted successfully! 🚀", "success");
            router.push("/");

        } catch (error: any) {
            console.error(error);
            addToast(error.message || "Failed to upload meme", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feed-container pt-10">
            <div className="max-w-2xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                        Share a Meme
                    </h1>
                    <p className="text-[var(--foreground-muted)] max-w-sm mx-auto">
                        Post your best memes and join the community.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[var(--background-elevated)] border border-[var(--border)] rounded-2xl p-6 sm:p-7 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Upload Section */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2 pl-1">
                                <span className="p-1.5 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                                    <Wand2 size={14} />
                                </span>
                                Choose Meme Content
                            </label>
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-1 hover:border-[var(--accent-primary)]/30 transition-colors">
                                <UploadForm onFileSelect={setFile} />
                            </div>
                        </div>

                        {/* Caption Section */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-[var(--foreground)] flex justify-between items-center pl-1">
                                <div className="flex items-center gap-2">
                                    <span className="p-1.5 rounded-lg bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
                                        <Wand2 size={14} />
                                    </span>
                                    Add a Caption
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2.5 py-1 rounded-full border border-[var(--accent-primary)]/20">
                                    AI Magic
                                </span>
                            </label>

                            <div className="relative group">
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Write something funny that matches the vibe..."
                                    className="w-full h-40 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all resize-none outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
                                />
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!file) {
                                            addToast("Please upload an image first!", "error");
                                            return;
                                        }

                                        setIsUploading(true);
                                        try {
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${user?.id || 'temp'}/${Date.now()}-${file.name}`;
                                            const { error: uploadError } = await supabase.storage
                                                .from('memes')
                                                .upload(fileName, file);

                                            if (uploadError) throw uploadError;

                                            const { data: { publicUrl } } = supabase.storage
                                                .from('memes')
                                                .getPublicUrl(fileName);

                                            const response = await fetch("/api/ai/generate", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ imageUrl: publicUrl }),
                                            });

                                            const aiData = await response.json();
                                            if (aiData.error) throw new Error(aiData.error);

                                            setCaption(aiData.caption);
                                            addToast("AI caption generated!", "success");

                                        } catch (error: any) {
                                            console.error("AI Error:", error);
                                            addToast(error.message || "AI Generation failed.", "error");
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }}
                                    className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group-focus-within:opacity-100 opacity-80 backdrop-blur-md border border-[var(--accent-primary)]/20"
                                    disabled={isUploading || !file || file.type.startsWith('video/')}
                                    title={file?.type.startsWith('video/') ? "AI captions available for images only" : "Auto-generate caption"}
                                >
                                    {isUploading ? (
                                        <span className="animate-spin">⏳</span>
                                    ) : (
                                        <>
                                            <Wand2 size={16} />
                                            <span className="text-xs font-semibold">Magic Fill</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[var(--border)] w-full" />

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => window.history.back()}
                                className="flex-1 h-12 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-[2] h-12 bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] font-bold rounded-xl shadow-lg hover:shadow-[var(--accent-primary)]/20 hover:opacity-90 active:scale-[0.98] transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Posting..." : "Post Meme 🚀"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
