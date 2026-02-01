"use client";
// Updated with proper spacing - v2

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

export interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            addToast('Link copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            addToast('Failed to copy link', 'error');
        }
    };

    const shareToSocial = (platform: string) => {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);

        const urls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
        addToast(`Shared to ${platform}!`, 'success');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal-backdrop)]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[var(--z-modal)] w-full max-w-lg px-4">
                <div className="bg-[var(--background-elevated)] rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden animate-scale-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)]">
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Share Meme</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors -mr-2"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8 space-y-8">
                        {/* Copy Link */}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)] mb-4">
                                Copy Link
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={url}
                                    readOnly
                                    className="flex-1 px-4 py-3.5 bg-[var(--muted)] rounded-xl text-sm text-[var(--foreground)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-mono"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className={cn(
                                        "px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 shrink-0",
                                        copied
                                            ? "bg-green-500/20 text-green-500"
                                            : "bg-[var(--accent-primary)] text-[hsl(220,25%,10%)] hover:opacity-90"
                                    )}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span className="hidden sm:inline">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            <span className="hidden sm:inline">Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)] mb-4">
                                Share to Social Media
                            </label>
                            <div className="grid grid-cols-4 gap-4">
                                <button
                                    onClick={() => shareToSocial('twitter')}
                                    className="flex flex-col items-center gap-3 py-5 px-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-hover)] transition-colors group"
                                >
                                    <div className="text-3xl group-hover:scale-110 transition-transform">𝕏</div>
                                    <span className="text-xs font-semibold text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">Twitter</span>
                                </button>
                                <button
                                    onClick={() => shareToSocial('facebook')}
                                    className="flex flex-col items-center gap-3 py-5 px-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-hover)] transition-colors group"
                                >
                                    <div className="text-3xl group-hover:scale-110 transition-transform">📘</div>
                                    <span className="text-xs font-semibold text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">Facebook</span>
                                </button>
                                <button
                                    onClick={() => shareToSocial('whatsapp')}
                                    className="flex flex-col items-center gap-3 py-5 px-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-hover)] transition-colors group"
                                >
                                    <div className="text-3xl group-hover:scale-110 transition-transform">💬</div>
                                    <span className="text-xs font-semibold text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">WhatsApp</span>
                                </button>
                                <button
                                    onClick={() => shareToSocial('telegram')}
                                    className="flex flex-col items-center gap-3 py-5 px-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-hover)] transition-colors group"
                                >
                                    <div className="text-3xl group-hover:scale-110 transition-transform">✈️</div>
                                    <span className="text-xs font-semibold text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">Telegram</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
