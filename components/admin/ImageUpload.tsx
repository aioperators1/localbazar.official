"use client";

import { useState, useRef, useMemo } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Image as ImageIcon, Loader2, GripVertical } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    onRemove: (url: string) => void;
    disabled?: boolean;
}

interface SortableImageProps {
    url: string;
    index: number;
    onRemove: (url: string) => void;
    disabled?: boolean;
}

function SortableImage({ url, index, onRemove, disabled }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className={cn(
                "flex flex-col gap-2 group",
                isDragging && "opacity-50"
            )}
        >
            <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {index === 0 ? "1. Primary Image (Cover)" : index === 1 ? "2. Hover Flip Image (Secondary)" : `${index + 1}. Gallery Image`}
                </span>
                {!disabled && (
                    <div 
                        {...attributes} 
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <GripVertical className="w-3 h-3 text-gray-300 group-hover:text-black transition-colors" />
                    </div>
                )}
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-white group shadow-sm transition-all hover:shadow-md">
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
                            className="h-12 w-12 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300"
                        >
                            <Trash2 className="w-6 h-6" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = value.indexOf(active.id as string);
            const newIndex = value.indexOf(over.id as string);
            onChange(arrayMove(value, oldIndex, newIndex));
        }
    };

    const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter(f => f.size <= 10 * 1024 * 1024);
        if (validFiles.length < files.length) {
            toast.error("Some files were skipped because they exceed 10MB");
        }

        if (validFiles.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        try {
            setLoading(true);
            const uploadPromises = validFiles.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) throw new Error("Upload failed");
                const data = await response.json();
                return data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            onChange([...value, ...uploadedUrls]);
            toast.success(`${uploadedUrls.length} image(s) added`);
        } catch (error) {
            toast.error("Failed to upload images");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4">
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SortableContext 
                        items={value}
                        strategy={rectSortingStrategy}
                    >
                        {value.map((url, idx) => (
                            <SortableImage 
                                key={url} 
                                url={url} 
                                index={idx} 
                                onRemove={onRemove}
                                disabled={disabled}
                            />
                        ))}
                    </SortableContext>

                    {/* Upload Trigger */}
                    {!disabled && (
                        <div className="flex flex-col gap-2 h-full">
                            <div className="flex items-center justify-between px-1 invisible">
                                <span className="text-[9px] font-black uppercase">Placeholder</span>
                            </div>
                            {isCloudinaryConfigured ? (
                                <CldUploadWidget 
                                    onSuccess={(result: any) => onChange([...value, result.info.secure_url])} 
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "localbazar"}
                                >
                                    {({ open }) => (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="flex flex-col items-center justify-center gap-4 aspect-[3/4] border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 rounded-xl bg-white transition-all duration-500 group"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                                <ImagePlus className="w-8 h-8 text-gray-300 group-hover:text-black transition-colors" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Cloud Upload</p>
                                                <p className="text-[10px] font-bold text-gray-200 mt-1">High Quality Assets</p>
                                            </div>
                                        </button>
                                    )}
                                </CldUploadWidget>
                            ) : (
                                <>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleLocalUpload}
                                    />
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-4 aspect-[3/4] border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 rounded-xl bg-white transition-all duration-500 group disabled:opacity-50"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                            {loading ? (
                                                <Loader2 className="w-8 h-8 text-black animate-spin" />
                                            ) : (
                                                <ImagePlus className="w-8 h-8 text-gray-300 group-hover:text-black transition-colors" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Local Gallery</p>
                                            <p className="text-[10px] font-bold text-gray-200 mt-1">Select from Device</p>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </DndContext>
            
            {!isCloudinaryConfigured && (
                <div className="p-5 bg-black rounded-xl border border-white/5 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="text-[10px] font-black text-white/40 leading-relaxed uppercase tracking-[2px] flex items-center gap-3 relative z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                        Logistics Active • Local Storage System Online
                    </div>
                </div>
            )}
        </div>
    );
}
