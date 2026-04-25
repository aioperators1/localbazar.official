"use client";

import { useEffect, useState, useTransition } from "react";
import { getNoticeSettings, updateNoticeSettings } from "@/lib/actions/admin";
import { Megaphone, Save, Power, Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NoticeBarPage() {
    const [text, setText] = useState("");
    const [active, setActive] = useState(false);
    const [bgColor, setBgColor] = useState("#000000");
    const [textColor, setTextColor] = useState("#FFFFFF");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const load = async () => {
            const data = await getNoticeSettings();
            setText(data.text);
            setActive(data.active);
            setBgColor(data.bgColor);
            setTextColor(data.textColor);
        };
        load();
    }, []);

    const handleSave = () => {
        startTransition(async () => {
            const res = await updateNoticeSettings(text, active, bgColor, textColor);
            if (res.success) {
                toast.success("Settings Saved", {
                    className: "font-bold text-[10px] uppercase tracking-widest bg-black text-white border-none"
                });
            } else {
                toast.error(res.error || "Update failed");
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Simple Pro Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-black tracking-tighter uppercase leading-none">Notice Bar</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Surgical Configuration</p>
                    </div>
                </div>

                <Button 
                    onClick={handleSave}
                    disabled={isPending}
                    className="h-11 px-8 bg-black text-white hover:bg-black/90 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2"
                >
                    {isPending ? "Saving..." : "Save Protocol"}
                    {!isPending && <Save className="w-4 h-4" />}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Configuration Matrix */}
                <div className="md:col-span-8 space-y-8">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-8 space-y-12">
                            {/* Status & Appearance Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block">System Status</span>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-black text-black uppercase tracking-tight">{active ? 'Active' : 'Disabled'}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Storefront Visibility</span>
                                        </div>
                                        <button 
                                            onClick={() => setActive(!active)}
                                            className={cn(
                                                "relative w-10 h-5 rounded-full transition-all duration-300 outline-none",
                                                active ? "bg-black" : "bg-gray-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all transform",
                                                active && "translate-x-5"
                                            )} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block">Chroma Palette</span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 flex flex-col gap-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Background</label>
                                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <input 
                                                    type="color" 
                                                    value={bgColor} 
                                                    onChange={(e) => setBgColor(e.target.value)}
                                                    className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-none"
                                                />
                                                <span className="text-[10px] font-bold text-black uppercase">{bgColor}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Text Color</label>
                                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <input 
                                                    type="color" 
                                                    value={textColor} 
                                                    onChange={(e) => setTextColor(e.target.value)}
                                                    className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-none"
                                                />
                                                <span className="text-[10px] font-bold text-black uppercase">{textColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Logic */}
                            <div className="space-y-4 pt-10 border-t border-gray-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Announcement Protocol</span>
                                    <span className="text-[9px] font-black text-gray-300 uppercase">{text.length}/500</span>
                                </div>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full min-h-[160px] bg-gray-50 border border-gray-200 rounded-xl p-6 text-[15px] font-medium text-black placeholder-gray-300 focus:bg-white focus:border-black transition-all outline-none resize-none leading-relaxed"
                                    placeholder="Enter circular announcement text..."
                                />
                                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 border border-blue-100/50 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                        Use '•' freely. The engine will bridge segments for a seamless 360° infinite loop.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div className="md:col-span-4 space-y-6">
                    <div 
                        className="rounded-xl p-8 space-y-6 shadow-2xl transition-all duration-500 overflow-hidden relative"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Palette className="w-4 h-4" style={{ color: textColor }} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: textColor }}>Real-time Preview</span>
                        </div>
                        
                        <div className="h-px w-full bg-white/10 relative z-10" />

                        <div className="relative h-12 flex items-center justify-center overflow-hidden border border-white/5 rounded-lg z-10">
                             <div className="flex items-center gap-8 px-4" style={{ color: textColor }}>
                                 <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap animate-pulse">
                                     {text || "SYSTEM_STANDBY_NOTICE"}
                                 </span>
                             </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-2 relative z-10">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: textColor }}>
                                <span>Background Color</span>
                                <span>{bgColor}</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: textColor }}>
                                <span>Text Chroma</span>
                                <span>{textColor}</span>
                            </div>
                        </div>

                        {/* Aesthetic background mesh */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6 text-center border-dashed">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] leading-loose">
                            Architectural integrity verified. <br />
                            Mobile & Desktop parity: ACTIVE.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
