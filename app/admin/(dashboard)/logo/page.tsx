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
        <div className="space-y-8 pb-12 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Identity & Branding</h1>
                    <p className="text-[13px] text-gray-500 font-medium">Configure the official logo displayed across the boutique ecosystem.</p>
                </div>
                {canEdit('logo') && (
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-black text-white hover:bg-gray-800 h-10 px-6 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all text-[12px]"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Deploying..." : "Update Website Logo"}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                <Palette className="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                                <h2 className="text-[16px] font-bold text-black tracking-tight">Official Website Logo</h2>
                                <p className="text-[12px] font-medium text-gray-500 mt-0.5">This image will replace the text-based branding.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-10">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[12px] font-semibold text-gray-700">Active Logo Asset</h3>
                                    {logoUrl && canEdit('logo') && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setLogoUrl("")}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 text-[11px] font-semibold rounded-md transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Revert to Text Branding
                                        </Button>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-12 rounded-xl border border-gray-200 border-dashed flex items-center justify-center min-h-[350px] relative overflow-hidden transition-all hover:bg-gray-100/50">
                                    {logoUrl ? (
                                        <div className="relative group p-8">
                                            <img 
                                                src={logoUrl} 
                                                alt="Website Logo" 
                                                className="max-h-[140px] w-auto transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-gray-400">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                                                <ImageIcon className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[13px] font-bold text-black">No Logo Deployed</p>
                                                <p className="text-[12px] text-gray-500 mt-1 max-w-[250px] leading-relaxed">The boutique is currently using text branding.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[12px] font-semibold text-gray-700">Upload New Asset</h3>
                                <ImageUpload 
                                    value={logoUrl ? [logoUrl] : []}
                                    onChange={(urls) => setLogoUrl(urls[0] || "")}
                                    onRemove={() => setLogoUrl("")}
                                    disabled={!canEdit('logo')}
                                />
                                <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 mt-6">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <Palette className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-bold text-blue-900">Recommended Specifications</p>
                                        <p className="text-[11px] font-medium text-blue-700/80 leading-relaxed">
                                            For optimal performance across all device types, use a <span className="font-bold">transparent PNG or SVG</span>. 
                                            The system will automatically scale the asset to fit the global navigation headers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-[13px] font-bold text-emerald-900 tracking-tight">System Synchronization Active</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Deployment State</p>
                            <p className="text-[12px] text-emerald-700/80 leading-relaxed">
                                Updates made to the identity assets are propagated instantly to the storefront and management interfaces.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Dynamic Scaling</p>
                            <p className="text-[12px] text-emerald-700/80 leading-relaxed">
                                The logo will automatically adapt to fit the responsive navigation headers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
