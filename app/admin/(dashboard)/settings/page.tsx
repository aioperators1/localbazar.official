"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
    Save, 
    Globe, 
    Phone, 
    Mail, 
    MapPin, 
    Type, 
    Image as ImageIcon,
    Layout,
    Search,
    Share2,
    CheckCircle2,
    Loader2,
    Shield,
    Zap,
    Cpu,
    Activity,
    Smartphone,
    Monitor,
    Instagram,
    Facebook,
    Twitter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getAdminSettings, updateAdminSettings } from "@/lib/actions/admin";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const { canEdit } = usePermissions();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({
        siteName: "Local Bazar",
        siteDescription: "Luxury Shopping Destination",
        contactEmail: "contact@localbazar.qa",
        contactPhone: "+974 0000 0000",
        whatsappNumber: "+974 0000 0000",
        address: "Doha, Qatar",
        instagramUrl: "",
        facebookUrl: "",
        twitterUrl: "",
        maintenanceMode: "false",
        luxuryTheme: "true",
        homepageTitle: "Doha Signature",
        homepageSubtitle: "LUXURY COLLECTION",
        aboutText: "Experience the ultimate expression of modesty and elegance with our handcrafted abayas.",
        homepageImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000",
        heroWatermark: "AUTHENTIC",
    });

    useEffect(() => {
        async function loadSettings() {
            try {
                const data = await getAdminSettings();
                if (data && Object.keys(data).length > 0) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleToggle = (key: string, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: String(value) }));
    };

    const handleSave = async () => {
        if (!canEdit('settings')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        setSaving(true);
        try {
            const res = await updateAdminSettings(settings);
            if (res.success) {
                toast.success("SYSTEM STATE SYNCHRONIZED");
            } else {
                toast.error("SYNCHRONIZATION FAILED");
            }
        } catch (error) {
            toast.error("CRITICAL KERNEL ERROR");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 animate-pulse">
                <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-white/40 animate-spin" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Synthesizing Core Configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000 max-w-7xl mx-auto">
            {/* 🌌 ULTRA PRO HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 rounded-[22px] flex items-center justify-center border border-white/10 shadow-2xl">
                            <Cpu className="w-7 h-7 text-white/40" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Core Parameters</h1>
                            <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.4em] mt-3 ml-1">Universal System Configuration Hub</p>
                        </div>
                    </div>
                </div>
                {canEdit('settings') && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="bg-white text-black hover:bg-white/90 h-14 px-10 rounded-[22px] font-black text-[12px] uppercase tracking-widest shadow-2xl flex items-center gap-4 transition-all"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? "PROPAGATING..." : "Publish Specifications"}
                        </Button>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* General Branding Section */}
                    <div className="glass-card rounded-[48px] border border-white/5 shadow-2xl overflow-hidden bg-[#0A0A0A]/40 backdrop-blur-3xl">
                        <div className="bg-white/[0.03] p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[18px] bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Type className="w-6 h-6 text-white/60" />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-black uppercase tracking-tight text-white italic">Identity Matrix</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Foundational Corporate Branding</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Official Store Designation</Label>
                                    <Input 
                                        value={settings.siteName} 
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-8 text-[16px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Digital Operations Handle</Label>
                                    <div className="relative group">
                                        <Input 
                                            value={settings.siteName.toLowerCase().replace(/\s+/g, '')}
                                            disabled
                                            className="h-16 bg-white/[0.01] border-white/5 rounded-2xl pl-12 text-[14px] font-black italic text-white/40"
                                        />
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black text-sm">@</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">System Narrative / Executive Summary</Label>
                                <Textarea 
                                    value={settings.siteDescription}
                                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                                    className="min-h-[140px] bg-white/[0.03] border-white/5 rounded-[28px] p-8 text-[15px] font-medium text-white leading-relaxed focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none resize-none"
                                    disabled={!canEdit('settings')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Storefront Hero Matrix */}
                    <div className="glass-card rounded-[48px] border border-white/5 shadow-2xl overflow-hidden bg-[#0A0A0A]/40 backdrop-blur-3xl">
                        <div className="bg-white/[0.03] p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[18px] bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                                    <Layout className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-black uppercase tracking-tight text-white italic">Interface Hero Module</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Primary Landing Aesthetics</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Executive Title</Label>
                                    <Input 
                                        value={settings.homepageTitle} 
                                        onChange={(e) => handleChange('homepageTitle', e.target.value)}
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-8 text-[16px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Operational Subtitle</Label>
                                    <Input 
                                        value={settings.homepageSubtitle} 
                                        onChange={(e) => handleChange('homepageSubtitle', e.target.value)}
                                        className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-8 text-[16px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                     <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Dynamic Watermark</Label>
                                     <Input 
                                         value={settings.heroWatermark} 
                                         onChange={(e) => handleChange('heroWatermark', e.target.value)}
                                         className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-8 text-[14px] font-black tracking-widest text-blue-400 focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none uppercase"
                                         disabled={!canEdit('settings')}
                                     />
                                </div>
                                 <div className="space-y-4">
                                     <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Visual Atmosphere Background</Label>
                                     <div className="bg-white/[0.02] p-6 rounded-[28px] border border-white/5 group transition-all hover:bg-white/[0.04]">
                                         <ImageUpload 
                                             value={settings.homepageImage ? [settings.homepageImage] : []}
                                             onChange={(urls) => handleChange('homepageImage', urls[0] || "")}
                                             onRemove={() => handleChange('homepageImage', "")}
                                             disabled={!canEdit('settings')}
                                         />
                                     </div>
                                 </div>
                            </div>
                        </div>
                    </div>

                    {/* Critical Communication Hub */}
                    <div className="glass-card rounded-[48px] border border-white/5 shadow-2xl overflow-hidden bg-[#0A0A0A]/40 backdrop-blur-3xl">
                        <div className="bg-white/[0.03] p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[18px] bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-black uppercase tracking-tight text-white italic">Connectivity Protocol</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Official Response Channels</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Primary Email Relay</Label>
                                    <div className="relative">
                                         <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                         <Input 
                                             value={settings.contactEmail} 
                                             onChange={(e) => handleChange('contactEmail', e.target.value)}
                                             className="h-16 bg-white/[0.03] border-white/5 rounded-2xl pl-16 pr-8 text-[15px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Secure Voice Line</Label>
                                    <div className="relative">
                                         <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                         <Input 
                                             value={settings.contactPhone} 
                                             onChange={(e) => handleChange('contactPhone', e.target.value)}
                                             className="h-16 bg-white/[0.03] border-white/5 rounded-2xl pl-16 pr-8 text-[15px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">WhatsApp Direct Vector</Label>
                                    <div className="relative">
                                        <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <Input 
                                            value={settings.whatsappNumber}
                                            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                                            className="h-16 bg-white/[0.03] border-white/5 rounded-2xl pl-16 pr-8 text-[15px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                            disabled={!canEdit('settings')}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Physical HQ Navigation</Label>
                                    <div className="relative">
                                         <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                         <Input 
                                             value={settings.address}
                                             onChange={(e) => handleChange('address', e.target.value)}
                                             className="h-16 bg-white/[0.03] border-white/5 rounded-2xl pl-16 pr-8 text-[15px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-12">
                    {/* System Logic Control */}
                    <div className="glass-card rounded-[48px] border border-white/5 shadow-2xl p-10 bg-[#0A0A0A]/40 backdrop-blur-3xl space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] pointer-events-none" />
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                                <Activity className="w-6 h-6 text-white/60" />
                            </div>
                            <h3 className="text-[15px] font-black uppercase tracking-widest text-white italic">Operational Logic</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { id: 'luxuryTheme', label: 'Ultra Core Engine v4', sub: 'Adaptive high-performance UI', value: settings.luxuryTheme === 'true', icon: Zap },
                                { id: 'maintenanceMode', label: 'Stasis / Lockdown Mode', sub: 'System offline for deployment', value: settings.maintenanceMode === 'true', icon: Shield },
                            ].map((opt) => (
                                <div 
                                    key={opt.id}
                                    onClick={() => canEdit('settings') && handleToggle(opt.id, !opt.value)}
                                    className={cn(
                                        "flex items-center justify-between p-6 rounded-[28px] border transition-all cursor-pointer group/opt",
                                        opt.value 
                                            ? "bg-white/5 border-white/20 shadow-lg shadow-white/5" 
                                            : "bg-white/[0.01] border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                            opt.value ? "bg-white text-black" : "bg-white/5 text-white/20 group-hover/opt:text-white"
                                        )}>
                                            <opt.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-black text-white uppercase tracking-tight">{opt.label}</span>
                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.1em]">{opt.sub}</span>
                                        </div>
                                    </div>
                                    <Switch 
                                        checked={opt.value} 
                                        onCheckedChange={(val) => handleToggle(opt.id, val)}
                                        disabled={!canEdit('settings')}
                                        className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/10"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Resonance */}
                    <div className="glass-card rounded-[48px] border border-white/5 shadow-2xl p-10 bg-[#0A0A0A]/40 backdrop-blur-3xl space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                                <Share2 className="w-6 h-6 text-white/60" />
                            </div>
                            <h3 className="text-[15px] font-black uppercase tracking-widest text-white italic">Social Signal Hub</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { id: 'instagramUrl', label: 'Instagram Vector', icon: Instagram, color: 'text-pink-500' },
                                { id: 'facebookUrl', label: 'Facebook Matrix', icon: Facebook, color: 'text-blue-500' },
                                { id: 'twitterUrl', label: 'X (Twitter) Link', icon: Twitter, color: 'text-sky-400' },
                            ].map((social) => (
                                <div key={social.id} className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">{social.label}</Label>
                                    <div className="relative group/input">
                                         <social.icon className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-all group-focus-within/input:scale-110", social.color)} />
                                         <Input 
                                             value={settings[social.id]} 
                                             onChange={(e) => handleChange(social.id, e.target.value)}
                                             placeholder="https://identity..."
                                             className="h-14 bg-white/[0.03] border-white/5 rounded-[22px] pl-16 text-[12px] font-black text-white focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Core Integrity Status */}
                    <div className="bg-white text-black rounded-[40px] p-10 space-y-6 shadow-[0_40px_100px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 blur-[50px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-emerald-500 blur-md opacity-20 rounded-full animate-pulse" />
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 relative" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">System Status: NOMINAL</span>
                        </div>
                        <div className="space-y-2">
                             <p className="text-[13px] font-black leading-tight">PLATINUM CORE v2.4.0</p>
                             <p className="text-[11px] font-medium opacity-40 uppercase tracking-tighter">Architecture by AI Operators Group Elite</p>
                        </div>
                        <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
