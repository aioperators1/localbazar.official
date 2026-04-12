"use client";

import { useState, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    onRemove: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onUpload = (result: any) => {
        onChange([...value, result.info.secure_url]);
    };

    const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size too large (max 10MB)");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const data = await response.json();
            onChange([...value, data.url]);
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {value.map((url, idx) => (
                    <div key={url} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                                {idx === 0 ? "1. Primary Image (Cover)" : idx === 1 ? "2. Hover Flip Image (Secondary)" : `${idx + 1}. Gallery Image`}
                            </span>
                        </div>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-white/[0.03] group">
                            <Image 
                                fill 
                                src={url} 
                                alt="Product" 
                                className="object-cover"
                                unoptimized
                            />
                            {!disabled && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        size="icon" 
                                        onClick={() => onRemove(url)}
                                        className="h-12 w-12 rounded-full shadow-2xl"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Upload Trigger */}
                {!disabled && (
                    <div className="flex flex-col gap-2 h-full">
                        <div className="flex items-center justify-between px-1 invisible">
                            <span className="text-[9px] font-black uppercase">Placeholder</span>
                        </div>
                        {isCloudinaryConfigured ? (
                            <CldUploadWidget 
                                onSuccess={onUpload} 
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "localbazar"}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="flex flex-col items-center justify-center gap-4 aspect-[3/4] border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.03] rounded-xl bg-white/[0.01] transition-all duration-500 group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <ImagePlus className="w-8 h-8 text-white/40" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[12px] font-black uppercase tracking-widest text-white/60">Cloudinary Upload</p>
                                            <p className="text-[10px] font-bold text-white/20 mt-1">PNG, JPG or WebP</p>
                                        </div>
                                    </button>
                                )}
                            </CldUploadWidget>
                        ) : (
                            <>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleLocalUpload}
                                />
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center gap-4 aspect-[3/4] border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.03] rounded-xl bg-white/[0.01] transition-all duration-500 group disabled:opacity-50"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        {loading ? (
                                            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                                        ) : (
                                            <ImagePlus className="w-8 h-8 text-white/40" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[12px] font-black uppercase tracking-widest text-white/60">Local Upload</p>
                                        <p className="text-[10px] font-bold text-white/20 mt-1">PNG, JPG or WebP</p>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            
             {!isCloudinaryConfigured && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="text-[11px] font-bold text-emerald-400 leading-relaxed uppercase tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Local Upload Mode Active • Images are saved locally.
                    </div>
                </div>
            )}
        </div>
    );
}
