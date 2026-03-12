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
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getAdminSettings, updateAdminSettings } from "@/lib/actions/admin";

export default function SettingsPage() {
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
        setSaving(true);
        try {
            const res = await updateAdminSettings(settings);
            if (res.success) {
                toast.success("Settings updated successfully");
            } else {
                toast.error("Failed to update settings");
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
                <Loader2 className="w-8 h-8 text-black animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">System Settings</h1>
                    <p className="text-[13px] text-[#616161] font-medium mt-1">Manage your boutique's global configuration and identity.</p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-black text-white hover:bg-[#333] h-10 px-6 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving Changes..." : "Publish Settings"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Branding */}
                    <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E3E3] flex items-center justify-center shadow-sm">
                                    <Type className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <CardTitle className="text-[16px] font-black uppercase tracking-tight">General Branding</CardTitle>
                                    <CardDescription className="text-[12px] font-medium">Define your store's public identity.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Store Name</Label>
                                    <Input 
                                        value={settings.siteName} 
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        className="h-10 border-[#D2D2D2] rounded-lg focus:ring-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Store Handle</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-[#A1A1A1] text-[13px]">@</span>
                                        <Input 
                                            value={settings.siteName.toLowerCase().replace(/\s+/g, '')}
                                            disabled
                                            className="h-10 border-[#D2D2D2] rounded-lg pl-8 bg-[#F9F9F9] text-[#A1A1A1]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Tagline / Description</Label>
                                <Textarea 
                                    value={settings.siteDescription}
                                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                                    className="min-h-[100px] border-[#D2D2D2] rounded-lg focus:ring-black resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E3E3] flex items-center justify-center shadow-sm">
                                    <Phone className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <CardTitle className="text-[16px] font-black uppercase tracking-tight">Store Contact</CardTitle>
                                    <CardDescription className="text-[12px] font-medium">How customers get in touch with you.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Customer Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-[#A1A1A1]" />
                                        <Input 
                                            value={settings.contactEmail}
                                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                                            className="pl-10 h-10 border-[#D2D2D2] rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Support Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-4 h-4 text-[#A1A1A1]" />
                                        <Input 
                                            value={settings.contactPhone}
                                            onChange={(e) => handleChange('contactPhone', e.target.value)}
                                            className="pl-10 h-10 border-[#D2D2D2] rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">WhatsApp Redirect Number</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 w-4 h-4 text-[#25D366]">
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                    </div>
                                    <Input 
                                        value={settings.whatsappNumber}
                                        onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                                        placeholder="+974 0000 0000"
                                        className="pl-10 h-10 border-[#D2D2D2] rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Boutique Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#A1A1A1]" />
                                    <Input 
                                        value={settings.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className="pl-10 h-10 border-[#D2D2D2] rounded-lg"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO & Search */}
                    <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E3E3] flex items-center justify-center shadow-sm">
                                    <Search className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <CardTitle className="text-[16px] font-black uppercase tracking-tight">Search & SEO</CardTitle>
                                    <CardDescription className="text-[12px] font-medium">How your store appears in Google and search engines.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Default Meta Title</Label>
                                <Input 
                                    value={`${settings.siteName} | ${settings.siteDescription}`}
                                    disabled
                                    className="h-10 border-[#D2D2D2] rounded-lg bg-[#F9F9F9] text-[#A1A1A1]"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-lg border border-[#F1F1F1]">
                                <div className="space-y-0.5">
                                    <p className="text-[13px] font-black text-[#111111] uppercase tracking-tight">Indexable by Google</p>
                                    <p className="text-[11px] text-[#616161] font-medium">Allow search engines to crawl your boutique.</p>
                                </div>
                                <Switch checked={true} disabled />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Homepage Content */}
                    <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden mt-8">
                        <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E3E3] flex items-center justify-center shadow-sm">
                                    <Type className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <CardTitle className="text-[16px] font-black uppercase tracking-tight">Homepage Content</CardTitle>
                                    <CardDescription className="text-[12px] font-medium">Edit the main text visible on the storefront.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Hero Title</Label>
                                    <Input 
                                        value={settings.homepageTitle} 
                                        onChange={(e) => handleChange('homepageTitle', e.target.value)}
                                        className="h-10 border-[#D2D2D2] rounded-lg focus:ring-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Hero Subtitle</Label>
                                    <Input 
                                        value={settings.homepageSubtitle} 
                                        onChange={(e) => handleChange('homepageSubtitle', e.target.value)}
                                        className="h-10 border-[#D2D2D2] rounded-lg focus:ring-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">About / Description Text</Label>
                                    <Textarea 
                                        value={settings.aboutText} 
                                        onChange={(e) => handleChange('aboutText', e.target.value)}
                                        className="min-h-[100px] border-[#D2D2D2] rounded-lg focus:ring-black resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-black uppercase tracking-widest text-[#616161]">Hero Image URL</Label>
                                    <Input 
                                        value={settings.homepageImage || ""} 
                                        onChange={(e) => handleChange('homepageImage', e.target.value)}
                                        className="h-10 border-[#D2D2D2] rounded-lg focus:ring-black"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Appearance */}
                    <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E3E3] flex items-center justify-center shadow-sm">
                                    <Layout className="w-5 h-5 text-black" />
                                </div>
                                <CardTitle className="text-[15px] font-black uppercase tracking-tight">Appearance</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-bold text-[#333]">Luxury UI Core</span>
                                <Switch 
                                    checked={settings.luxuryTheme === 'true'} 
                                    onCheckedChange={(val) => handleToggle('luxuryTheme', val)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-bold text-[#333]">Maintenance Mode</span>
                                <Switch 
                                    checked={settings.maintenanceMode === 'true'} 
                                    onCheckedChange={(val) => handleToggle('maintenanceMode', val)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Connectivity */}
                    <Card className="border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-[#F9F9F9] border-b border-[#F1F1F1] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E3E3] flex items-center justify-center shadow-sm">
                                    <Share2 className="w-5 h-5 text-black" />
                                </div>
                                <CardTitle className="text-[15px] font-black uppercase tracking-tight">Social Media</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {[
                                { id: 'instagramUrl', label: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
                                { id: 'facebookUrl', label: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
                                { id: 'twitterUrl', label: 'Twitter', icon: 'https://cdn-icons-png.flaticon.com/512/124/124021.png' },
                            ].map((social) => (
                                <div key={social.id} className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8A8A]">{social.label}</Label>
                                    <Input 
                                        value={settings[social.id]} 
                                        onChange={(e) => handleChange(social.id, e.target.value)}
                                        placeholder={`https://...`}
                                        className="h-9 text-[12px] border-[#D2D2D2] rounded-lg"
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* System Status */}
                    <div className="bg-[#111111] rounded-xl p-6 text-white space-y-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">All Systems Nominal</span>
                        </div>
                        <p className="text-[12px] text-white/60 font-medium">
                            The Local Bazar core is running version <span className="text-white font-black">2.4.0-Platinum</span>.
                        </p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#25D366] w-[100%] shadow-[0_0_8px_#25D366]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
