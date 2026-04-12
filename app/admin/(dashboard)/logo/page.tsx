"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
    Save, 
    Image as ImageIcon,
    Loader2,
    Palette,
    CheckCircle2,
    Trash2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { getAdminSettings, updateAdminSettings } from "@/lib/actions/admin";
import { usePermissions } from "@/hooks/use-permissions";

export default function LogoPage() {
    const { canEdit } = usePermissions();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string>("");

    useEffect(() => {
        async function loadSettings() {
            try {
                const data = await getAdminSettings();
                if (data && data.website_logo_url) {
                    setLogoUrl(data.website_logo_url);
                }
            } catch (error) {
                console.error("Failed to load logo settings:", error);
                toast.error("Failed to load logo settings");
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        if (!canEdit('logo')) return toast.error("ACCESS DENIED");
        setSaving(true);
        try {
            const res = await updateAdminSettings({
                website_logo_url: logoUrl
            });
            if (res.success) {
                toast.success("Logo updated successfully");
            } else {
                toast.error("Failed to update logo");
            }
        } catch (error) {
            toast.error("A critical error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 max-w-4xl animate-in fade-in duration-1000">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">Identity & Branding</h1>
                    <p className="text-[13px] text-white/40 font-medium mt-1">Configure the official logo displayed across the boutique ecosystem.</p>
                </div>
                {canEdit('logo') && (
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-white text-black hover:bg-white/80 h-10 px-6 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 uppercase text-[11px] tracking-widest"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Deploying..." : "Update Website Logo"}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="glass-card border border-white/5 shadow-2xl rounded-[32px] overflow-hidden">
                    <div className="bg-white/[0.02] border-b border-white/5 p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                                <Palette className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-black uppercase tracking-tight text-white italic">Official Website Logo</h2>
                                <p className="text-[12px] font-medium text-white/40 mt-0.5">This image will replace the text-based branding.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-10">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">Active Logo Asset</h3>
                                    {logoUrl && canEdit('logo') && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setLogoUrl("")}
                                            className="text-rose-500 hover:text-white hover:bg-rose-500 h-8 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Revert to Text Branding
                                        </Button>
                                    )}
                                </div>
                                <div className="bg-white/[0.03] p-12 rounded-[24px] border border-white/5 border-dashed flex items-center justify-center min-h-[350px] relative overflow-hidden transition-all hover:bg-white/[0.05]">
                                    {logoUrl ? (
                                        <div className="relative group p-8">
                                            <img 
                                                src={logoUrl} 
                                                alt="Website Logo" 
                                                className="max-h-[140px] w-auto transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 border-2 border-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-6 text-white/20">
                                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                <ImageIcon className="w-12 h-12 opacity-40" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[13px] font-black uppercase tracking-[0.3em]">No Logo Deployed</p>
                                                <p className="text-[11px] font-bold mt-2 max-w-[250px] leading-relaxed">The boutique is currently using the adaptive premium text branding.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">Upload New Asset</h3>
                                <ImageUpload 
                                    value={logoUrl ? [logoUrl] : []}
                                    onChange={(urls) => setLogoUrl(urls[0] || "")}
                                    onRemove={() => setLogoUrl("")}
                                    disabled={!canEdit('logo')}
                                />
                                <div className="flex items-start gap-4 p-6 bg-white/[0.02] rounded-[24px] border border-white/5 mt-6">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Palette className="w-5 h-5 text-white/60" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-black uppercase tracking-tight text-white italic">Recommended Specifications</p>
                                        <p className="text-[11px] font-medium text-white/40 leading-relaxed">
                                            For optimal performance across all device types, use a <span className="text-white font-bold">transparent PNG or SVG</span>. 
                                            The system will automatically scale the asset to fit the global navigation headers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-10 text-white space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-40" />
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-emerald-500 blur-md opacity-20 rounded-full animate-pulse" />
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 relative" />
                        </div>
                        <span className="text-[14px] font-black uppercase tracking-[0.4em] italic">System Synchronization: Active</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Deployment State</p>
                            <p className="text-[13px] text-white/60 font-medium leading-relaxed italic">
                                Updates made to the identity assets are propagated instantly to the storefront and management interfaces using the <span className="text-white font-black italic">localbazar-sync-v3</span> protocol.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Dynamic Scaling</p>
                            <p className="text-[13px] text-white/60 font-medium leading-relaxed italic">
                                The logo will automatically adapt between light and dark modes of the storefront based on the asset transparency.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pt-6 border-t border-white/5">
                        <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 w-[100%] shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
