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
    Twitter,
    FileText,
    Banknote,
    Crosshair
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ShippingSettings } from "@/components/admin/ShippingSettings";
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
        codEnabled: "true",
        facebookPixelId: "",
        facebookAccessToken: "",
        snapchatPixelId: "",
        tiktokPixelId: "",
        homepageImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000",
        heroWatermark: "AUTHENTIC",
        shippingMethods: JSON.stringify([
            { id: "standard", name: "Standard Delivery", nameAr: "توصيل عادي", price: 35, duration: "2-3 Business Days" }
        ]),
        page_about: "Welcome to Local Bazar...",
        page_about_ar: "مرحبا بكم في لوكال بازار...",
        page_shipping: "Shipping details go here...",
        page_shipping_ar: "تفاصيل الشحن هنا...",
        page_terms: "Terms of service go here...",
        page_terms_ar: "شروط الخدمة هنا...",
        page_privacy: "Privacy policy goes here...",
        page_privacy_ar: "سياسة الخصوصية هنا...",
        page_about_image: "",
        page_shipping_image: "",
        page_terms_image: "",
        page_privacy_image: ""
    });

    useEffect(() => {
        async function loadSettings() {
            try {
                const data = await getAdminSettings();
                if (data && Object.keys(data).length > 0) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } catch (error: any) {
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
        } catch (error: any) {
            toast.error("CRITICAL KERNEL ERROR");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-black animate-spin" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Loading Configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Settings</h1>
                    <p className="text-[13px] text-gray-500">Configure core parameters and external connections.</p>
                </div>
                {canEdit('settings') && (
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-black text-white hover:bg-gray-800 h-12 px-8 rounded-lg font-semibold text-[13px] flex items-center gap-2 shadow-sm transition-all"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Settings"}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Branding Section */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                    <Type className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-black">Store Information</h2>
                                    <p className="text-[12px] font-medium text-gray-500 mt-1">Foundation of your store identity</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Store Name</Label>
                                    <Input 
                                        value={settings.siteName} 
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        className="bg-white border-gray-200 text-[14px] text-black"
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Store Handle</Label>
                                    <div className="relative">
                                        <Input 
                                            value={settings.siteName.toLowerCase().replace(/\s+/g, '')}
                                            disabled
                                            className="bg-gray-50 border-gray-200 text-[14px] text-gray-500 pl-8 pointer-events-none"
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[12px] font-semibold text-gray-700">Store Description</Label>
                                <Textarea 
                                    value={settings.siteDescription}
                                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                                    className="min-h-[100px] bg-white border-gray-200 text-[14px] text-black resize-none"
                                    disabled={!canEdit('settings')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Storefront Hero Matrix */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                    <Layout className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-black">Homepage Display</h2>
                                    <p className="text-[12px] font-medium text-gray-500 mt-1">Configure your main landing visual</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Display Title</Label>
                                    <Input 
                                        value={settings.homepageTitle} 
                                        onChange={(e) => handleChange('homepageTitle', e.target.value)}
                                        className="bg-white border-gray-200 text-[14px] text-black"
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Display Subtitle</Label>
                                    <Input 
                                        value={settings.homepageSubtitle} 
                                        onChange={(e) => handleChange('homepageSubtitle', e.target.value)}
                                        className="bg-white border-gray-200 text-[14px] text-black"
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                     <Label className="text-[12px] font-semibold text-gray-700">Decorative Background Text</Label>
                                     <Input 
                                         value={settings.heroWatermark} 
                                         onChange={(e) => handleChange('heroWatermark', e.target.value)}
                                         className="bg-white border-gray-200 text-[14px] text-black"
                                         disabled={!canEdit('settings')}
                                     />
                                </div>
                                 <div className="space-y-3">
                                     <Label className="text-[12px] font-semibold text-gray-700">Fallback Hero Background</Label>
                                     <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl">
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

                    {/* Contact & Physical Address */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-black">Contact Methods</h2>
                                    <p className="text-[12px] font-medium text-gray-500 mt-1">Official store communication lines</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Support Email</Label>
                                    <div className="relative">
                                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                         <Input 
                                             value={settings.contactEmail} 
                                             onChange={(e) => handleChange('contactEmail', e.target.value)}
                                             className="bg-white border-gray-200 pl-10 text-[14px] text-black"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Phone</Label>
                                    <div className="relative">
                                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                         <Input 
                                             value={settings.contactPhone} 
                                             onChange={(e) => handleChange('contactPhone', e.target.value)}
                                             className="bg-white border-gray-200 pl-10 text-[14px] text-black"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">WhatsApp</Label>
                                    <div className="relative">
                                        <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input 
                                            value={settings.whatsappNumber}
                                            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                                            className="bg-white border-gray-200 pl-10 text-[14px] text-black"
                                            disabled={!canEdit('settings')}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Company Address</Label>
                                    <div className="relative">
                                         <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                         <Input 
                                             value={settings.address}
                                             onChange={(e) => handleChange('address', e.target.value)}
                                             className="bg-white border-gray-200 pl-10 text-[14px] text-black"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Logistics Area */}
                    <ShippingSettings 
                        value={settings.shippingMethods} 
                        onChange={(val) => handleChange('shippingMethods', val)}
                        disabled={!canEdit('settings')}
                    />

                    {/* Company Pages Content Area */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Company Pages Content</h3>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-4 border-b border-gray-100 pb-8">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Our Story (EN)</Label>
                                    <Textarea value={settings.page_about || ""} onChange={(e) => handleChange("page_about", e.target.value)} className="min-h-[120px] bg-white" disabled={!canEdit('settings')} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Our Story (AR)</Label>
                                    <Textarea value={settings.page_about_ar || ""} onChange={(e) => handleChange("page_about_ar", e.target.value)} dir="rtl" className="min-h-[120px] bg-white text-right" disabled={!canEdit('settings')} />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Our Story Image</Label>
                                    <ImageUpload 
                                        value={settings.page_about_image ? [settings.page_about_image] : []}
                                        onChange={(urls) => handleChange("page_about_image", urls[0] || "")}
                                        onRemove={() => handleChange("page_about_image", "")}
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 border-b border-gray-100 pb-8">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Shipping Policy (EN)</Label>
                                    <Textarea value={settings.page_shipping || ""} onChange={(e) => handleChange("page_shipping", e.target.value)} className="min-h-[120px] bg-white" disabled={!canEdit('settings')} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Shipping Policy (AR)</Label>
                                    <Textarea value={settings.page_shipping_ar || ""} onChange={(e) => handleChange("page_shipping_ar", e.target.value)} dir="rtl" className="min-h-[120px] bg-white text-right" disabled={!canEdit('settings')} />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Shipping Policy Image</Label>
                                    <ImageUpload 
                                        value={settings.page_shipping_image ? [settings.page_shipping_image] : []}
                                        onChange={(urls) => handleChange("page_shipping_image", urls[0] || "")}
                                        onRemove={() => handleChange("page_shipping_image", "")}
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 border-b border-gray-100 pb-8">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Terms of Service (EN)</Label>
                                    <Textarea value={settings.page_terms || ""} onChange={(e) => handleChange("page_terms", e.target.value)} className="min-h-[120px] bg-white" disabled={!canEdit('settings')} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Terms of Service (AR)</Label>
                                    <Textarea value={settings.page_terms_ar || ""} onChange={(e) => handleChange("page_terms_ar", e.target.value)} dir="rtl" className="min-h-[120px] bg-white text-right" disabled={!canEdit('settings')} />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Terms Image</Label>
                                    <ImageUpload 
                                        value={settings.page_terms_image ? [settings.page_terms_image] : []}
                                        onChange={(urls) => handleChange("page_terms_image", urls[0] || "")}
                                        onRemove={() => handleChange("page_terms_image", "")}
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Privacy Policy (EN)</Label>
                                    <Textarea value={settings.page_privacy || ""} onChange={(e) => handleChange("page_privacy", e.target.value)} className="min-h-[120px] bg-white" disabled={!canEdit('settings')} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Privacy Policy (AR)</Label>
                                    <Textarea value={settings.page_privacy_ar || ""} onChange={(e) => handleChange("page_privacy_ar", e.target.value)} dir="rtl" className="min-h-[120px] bg-white text-right" disabled={!canEdit('settings')} />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-[12px] font-semibold text-gray-700">Privacy Image</Label>
                                    <ImageUpload 
                                        value={settings.page_privacy_image ? [settings.page_privacy_image] : []}
                                        onChange={(urls) => handleChange("page_privacy_image", urls[0] || "")}
                                        onRemove={() => handleChange("page_privacy_image", "")}
                                        disabled={!canEdit('settings')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {/* System Logic Control */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="w-5 h-5 text-gray-500" />
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Features Toggle</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { id: 'luxuryTheme', label: 'Use Luxury Theme', sub: 'Enable premium storefront UI', value: settings.luxuryTheme === 'true', icon: Zap },
                                { id: 'maintenanceMode', label: 'Maintenance Mode', sub: 'Temporarily lock the store', value: settings.maintenanceMode === 'true', icon: Shield },
                                { id: 'codEnabled', label: 'Cash on Delivery (COD)', sub: 'Enable COD payment method', value: settings.codEnabled === 'true', icon: Banknote },
                            ].map((opt: any) => (
                                <div 
                                    key={opt.id}
                                    onClick={() => canEdit('settings') && handleToggle(opt.id, !opt.value)}
                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-black">{opt.label}</span>
                                            <span className="text-[11px] font-medium text-gray-500">{opt.sub}</span>
                                        </div>
                                    </div>
                                    <Switch 
                                        checked={opt.value} 
                                        disabled={!canEdit('settings')}
                                        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300 pointer-events-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Share2 className="w-5 h-5 text-gray-500" />
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Social Links</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { id: 'instagramUrl', label: 'Instagram', icon: Instagram },
                                { id: 'facebookUrl', label: 'Facebook', icon: Facebook },
                                { id: 'twitterUrl', label: 'Twitter', icon: Twitter },
                            ].map((social: any) => (
                                <div key={social.id} className="space-y-2">
                                    <Label className="text-[12px] font-semibold text-gray-700 ml-1">{social.label}</Label>
                                    <div className="relative">
                                         <social.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                         <Input 
                                             value={settings[social.id]} 
                                             onChange={(e) => handleChange(social.id, e.target.value)}
                                             placeholder="https://..."
                                             className="bg-white border-gray-200 pl-10 text-[13px] text-black"
                                             disabled={!canEdit('settings')}
                                         />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tracking Pixels & Analytics */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Crosshair className="w-5 h-5 text-gray-500" />
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Tracking & Pixels</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[12px] font-semibold text-gray-700 ml-1">Facebook Pixel ID</Label>
                                <div className="relative">
                                     <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1877F2]" />
                                     <Input 
                                         value={settings.facebookPixelId || ""} 
                                         onChange={(e) => handleChange("facebookPixelId", e.target.value)}
                                         placeholder="e.g. 123456789012345"
                                         className="bg-white border-gray-200 pl-10 text-[13px] text-black"
                                         disabled={!canEdit("settings")}
                                     />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[12px] font-semibold text-gray-700 ml-1">Facebook Conversions API Token</Label>
                                <div className="relative">
                                     <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1877F2]" />
                                     <Input 
                                         value={settings.facebookAccessToken || ""} 
                                         onChange={(e) => handleChange("facebookAccessToken", e.target.value)}
                                         placeholder="EAAB..."
                                         className="bg-white border-gray-200 pl-10 text-[13px] text-black"
                                         disabled={!canEdit("settings")}
                                     />
                                </div>
                                <p className="text-[11px] text-gray-500 ml-1 mt-1">Required for server-side event tracking and deduplication.</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[12px] font-semibold text-gray-700 ml-1">Snapchat Pixel ID</Label>
                                <div className="relative">
                                     <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFFC00]" />
                                     <Input 
                                         value={settings.snapchatPixelId || ""} 
                                         onChange={(e) => handleChange("snapchatPixelId", e.target.value)}
                                         placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                         className="bg-white border-gray-200 pl-10 text-[13px] text-black"
                                         disabled={!canEdit("settings")}
                                     />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[12px] font-semibold text-gray-700 ml-1">TikTok Pixel ID</Label>
                                <div className="relative">
                                     <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]" />
                                     <Input 
                                         value={settings.tiktokPixelId || ""} 
                                         onChange={(e) => handleChange("tiktokPixelId", e.target.value)}
                                         placeholder="e.g. CXXXXXX..."
                                         className="bg-white border-gray-200 pl-10 text-[13px] text-black"
                                         disabled={!canEdit("settings")}
                                     />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
