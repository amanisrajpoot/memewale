"use client";

import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/useToast";

interface UploadFormProps {
    onFileSelect?: (file: File) => void;
}

export function UploadForm({ onFileSelect }: UploadFormProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Basic validation
        // Basic validation
        if (!file.type.startsWith("image/")) {
            addToast("Please upload an image file", "error");
            return;
        }

        // File size validation (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            addToast("File too large! Maximum size is 5MB", "error");
            return;
        }

        if (onFileSelect) {
            onFileSelect(file);
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeFile = () => {
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="relative rounded-xl overflow-hidden bg-[var(--background-elevated)] border border-[var(--border)] group">
                    <img
                        src={preview}
                        alt="Upload preview"
                        className="w-full h-[300px] object-contain bg-[var(--background-base)]"
                    />
                    <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
                        dragActive
                            ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                            : "border-[var(--border)] hover:border-[var(--foreground-muted)] hover:bg-[var(--muted)]"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    <div className="flex flex-col items-center gap-3 text-[var(--foreground-muted)]">
                        <div className="p-3 rounded-full bg-[var(--background-elevated)] shadow-sm">
                            <Upload size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs mt-1">
                                SVG, PNG, JPG or GIF (max. 5MB)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
