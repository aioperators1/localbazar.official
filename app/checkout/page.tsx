"use client";

import { useCart } from "@/hooks/use-cart";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { placeOrder } from "@/lib/actions/checkout";
import { validateVoucher } from "@/lib/actions/voucher";
import { getAdminSettings } from "@/lib/actions/admin";
import { ShoppingCart, Banknote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { EmptyState } from "@/components/store/EmptyState";
import { Branding } from "@/components/store/Branding";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart, voucher, setVoucher, discountAmount } = useCart();
    const router = useRouter();
    const { formatPrice: formatCurrency, currency } = useCurrency();
    const { t, language } = useLanguage();

    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [voucherCode, setVoucherCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [shippingMethods, setShippingMethods] = useState<any[]>([]);
    const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string>("");
    const [isCodEnabled, setIsCodEnabled] = useState(true);

    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    const GCC_COUNTRIES = {
        "Qatar": ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Al Shamal", "Umm Salal", "Al Daayen", "Al Shahaniya", "Lusail", "Mesaieed", "Dukhan"],
        "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Taif", "Tabuk", "Buraydah", "Khamis Mushait", "Abha", "Al Khobar"],
        "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
        "Kuwait": ["Kuwait City", "Al Ahmadi", "Hawalli", "Salmiya", "Al Jahra", "Farwaniya"],
        "Oman": ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur", "Seeb", "Rustaq"],
        "Bahrain": ["Manama", "Riffa", "Muharraq", "Hamad Town", "A'ali", "Isa Town", "Sitra"]
    };

    const GCC_COUNTRIES_AR = {
        "Qatar": ["الدوحة", "الريان", "الوكرة", "الخور", "الشمال", "أم صلال", "الضعاين", "الشيحانية", "لوسيل", "مسيعيد", "دخان"],
        "Saudi Arabia": ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الطائف", "تبوك", "بريدة", "خميس مشيط", "أبها", "الخبر"],
        "UAE": ["دبي", "أبو ظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"],
        "Kuwait": ["مدينة الكويت", "الأحمدي", "حولي", "السالمية", "الجهراء", "الفروانية"],
        "Oman": ["مسقط", "صلالة", "صحار", "نزوى", "صور", "السيب", "الرستاق"],
        "Bahrain": ["المنامة", "الرفاع", "المحرق", "مدينة حمد", "عالي", "مدينة عيسى", "سترة"]
    };

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "Qatar",
        city: language === 'ar' ? "الدوحة" : "Doha",
        address: "",
        buildingNo: "",
        street: "",
        zoneNo: "",
        zip: ""
    });

    // Update city when country changes
    useEffect(() => {
        const cities = language === 'ar' 
            ? GCC_COUNTRIES_AR[formData.country as keyof typeof GCC_COUNTRIES_AR] 
            : GCC_COUNTRIES[formData.country as keyof typeof GCC_COUNTRIES];
        
        if (cities && cities.length > 0) {
            setFormData(prev => ({ ...prev, city: cities[0] }));
        }
    }, [formData.country, language]);

    // --- Abandoned Checkout Tracking ---
    const orderCompletedRef = useRef(false);
    const lastSavedRef = useRef("");

    const saveAbandonedCheckout = useCallback(async () => {
        if (orderCompletedRef.current) return;
        if (!formData.email && !formData.phone) return;
        
        const fingerprint = JSON.stringify({ ...formData, itemCount: items.length });
        if (fingerprint === lastSavedRef.current) return; // Skip if nothing changed
        lastSavedRef.current = fingerprint;

        try {
            await fetch("/api/abandoned-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    cartItems: items.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        size: item.size,
                        color: item.color
                    })),
                    cartTotal: totalPrice()
                }),
            });
        } catch (error: any) {} // Silent - never break UX
    }, [formData, items, totalPrice]);

    // Save abandoned checkout when user navigates away
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (orderCompletedRef.current) return;
            if (!formData.email && !formData.phone) return;
            
            const payload = JSON.stringify({
                ...formData,
                cartItems: items.map((item: any) => ({
                    id: item.id, name: item.name, price: item.price,
                    quantity: item.quantity, image: item.image
                })),
                cartTotal: totalPrice()
            });
            
            navigator.sendBeacon("/api/abandoned-checkout", 
                new Blob([payload], { type: "application/json" })
            );
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [formData, items, totalPrice]);

    // Periodically save if user has entered info (every 10 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            if (formData.email || formData.phone) {
                saveAbandonedCheckout();
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [saveAbandonedCheckout, formData.email, formData.phone]);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        async function loadSettings() {
            const settings = await getAdminSettings();
            
            if (settings.codEnabled === 'false') {
                setIsCodEnabled(false);
                setPaymentMethod(prev => prev === "COD" ? "CARD" : prev);
            }
            
            if (settings.shippingMethods) {
                try {
                    const parsed = JSON.parse(settings.shippingMethods);
                    setShippingMethods(parsed);
                    if (parsed.length > 0) setSelectedShippingMethodId(parsed[0].id);
                } catch (e: any) {}
            }
        }
        loadSettings();
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Map address to include the new fields
        const fullAddress = formData.address || `${formData.buildingNo ? `Building ${formData.buildingNo}, ` : ''}${formData.street ? `Street ${formData.street}, ` : ''}${formData.zoneNo ? `Zone ${formData.zoneNo}` : ''}`.replace(/,\s*$/, '');

        const orderData = {
            ...formData,
            address: fullAddress, // Send the full concatenated string just in case, but checkout API also handles individual fields now
            items: items.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color
            })),
            total: totalPrice(),
            paymentMethod,
            voucherId: voucher?.id,
            shippingMethodId: selectedShippingMethodId,
            shippingMethodName: selectedShippingMethod.name,
            shippingCost: shippingMethods.length > 0 ? Number(shippingMethods.find((m: any) => m.id === selectedShippingMethodId)?.price || 35) : 35
        };

        const res = await placeOrder(orderData) as { success: boolean; orderId?: string; paymentUrl?: string; error?: string };

        if (res.success) {
            orderCompletedRef.current = true; // Prevent abandoned checkout tracking
            sessionStorage.setItem('localbazar_last_order', JSON.stringify({
                ...orderData,
                items: items, 
                orderId: res.orderId
            }));
            
            if (res.paymentUrl) {
                window.location.href = res.paymentUrl;
                return;
            }

            toast.success(t('checkout.success'));
            router.push(`/success?orderId=${res.orderId}`);
        } else {
            toast.error(res.error || t('checkout.error'));
        }

        setIsLoading(false);
    };

    if (!mounted) return <div className="p-20 text-center font-bold text-[#111111] animate-pulse uppercase tracking-[0.2em] text-[12px]">{t('checkout.preparing')}</div>;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-32 flex flex-col items-center">
                <EmptyState 
                    title={t('checkout.empty')} 
                    description={t('checkout.emptyDesc')}
                    icon="search"
                />
            </div>
        )
    }

    const selectedShippingMethod = shippingMethods.find((m: any) => m.id === selectedShippingMethodId) || { price: 35, name: "Standard", duration: "2-3 days", nameAr: "توصيل عادي" };
    const shippingCost = shippingMethods.length > 0 ? Number(selectedShippingMethod.price) : 35;

    const currentCities = language === 'ar' 
        ? GCC_COUNTRIES_AR[formData.country as keyof typeof GCC_COUNTRIES_AR] || []
        : GCC_COUNTRIES[formData.country as keyof typeof GCC_COUNTRIES] || [];

    return (
        <div className="min-h-screen bg-transparent text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Minimal Header */}
            <header className="border-b border-white/5 py-6 bg-transparent sticky top-0 z-50">
                <div className="container mx-auto px-4 max-w-[1200px] flex items-center justify-between">
                    <span className="text-[14px] font-black uppercase tracking-[0.4em] text-white/40">CHECKOUT</span>
                    <Link href="/cart" className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#111111] transition-colors">
                       <ShoppingCart className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 max-w-[1200px]">
                <div className="flex flex-col lg:flex-row gap-0">

                    {/* RIGHT COLUMN: Summary (Appears on TOP on mobile) */}
                    <div className={cn("bg-black/20 py-12 px-8 lg:px-12 border-b lg:border-b-0 border-white/10 order-1 lg:order-2 lg:w-[420px] shrink-0", language === 'ar' ? "lg:border-r" : "lg:border-l")}>
                        <div className="lg:sticky lg:top-32 space-y-8">
                            {/* Product List */}
                            <div className="space-y-6 text-white/90">
                                <h3 className="text-[14px] font-bold uppercase tracking-widest mb-4 opacity-50">{t('cart.title')}</h3>
                                {items.map((item: any, index: number) => (
                                    <div key={`${item.id}-${item.size || 'default'}-${item.color || 'default'}-${index}`} className="flex items-center gap-4">
                                        <div className="relative w-[64px] h-[64px] bg-white/10 border border-white/20 rounded-[8px] flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                            <div className={cn("absolute -top-1 w-[20px] h-[20px] bg-white text-[#1A0306] text-[10px] font-black rounded-full flex items-center justify-center z-10 shadow-sm leading-none", language === 'ar' ? "-left-1" : "-right-1")}>
                                                {item.quantity}
                                            </div>
                                            <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[12px] font-bold text-white leading-tight line-clamp-2 uppercase tracking-tight">{item.name}</h4>
                                            {(item.size || item.color) && (
                                                <div className="flex gap-2 mt-1 text-[10px] text-white/50 font-bold uppercase tracking-wider">
                                                    {item.size && <span>{t('product.size')}: {item.size}</span>}
                                                    {item.size && item.color && <span>/</span>}
                                                    {item.color && <span>{t('product.color')}: {item.color}</span>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-[13px] font-bold text-white whitespace-nowrap">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code */}
                            <div className="flex gap-3 pt-6 border-t border-white/10">
                                <input
                                    value={voucherCode}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVoucherCode(e.target.value.toUpperCase())}
                                    disabled={!!voucher}
                                    placeholder={voucher ? voucher.code : t('cart.voucher')}
                                    className="flex-1 h-[48px] px-4 rounded-[4px] border border-white/10 outline-none text-[13px] bg-white/5 text-white placeholder:text-white/20 placeholder:uppercase placeholder:tracking-widest focus:border-white/50 disabled:opacity-50 transition-colors"
                                />
                                {voucher ? (
                                    <button 
                                        type="button" 
                                        onClick={() => setVoucher(null)}
                                        className="h-[48px] px-6 bg-white/10 text-white font-bold rounded-[4px] text-[12px] transition-colors uppercase tracking-widest hover:bg-rose-500"
                                    >
                                        {t('cart.remove')}
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={async () => {
                                            if (!voucherCode) return;
                                            setIsApplying(true);
                                            const res = await validateVoucher(voucherCode);
                                            if (res.success) {
                                                setVoucher(res.voucher as { id: string; code: string; type: string; value: number });
                                                toast.success("Voucher applied!");
                                                setVoucherCode("");
                                            } else {
                                                toast.error(res.error || "Invalid voucher");
                                            }
                                            setIsApplying(false);
                                        }}
                                        disabled={isApplying}
                                        className="h-[48px] px-4 md:px-6 shrink-0 whitespace-nowrap bg-white hover:bg-white/80 text-[#1A0306] font-black rounded-[4px] text-[12px] transition-colors uppercase tracking-widest disabled:opacity-50"
                                    >
                                        {isApplying ? '. .' : t('cart.apply')}
                                    </button>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-4 pt-6 text-[14px]">
                                <div className="flex justify-between items-center text-white/40 uppercase tracking-widest font-bold text-[11px]">
                                    <span>{t('cart.subtotal')}</span>
                                    <span className="text-white/80">{formatCurrency(subtotal)}</span>
                                </div>
                                {voucher && (
                                    <div className="flex justify-between items-center text-emerald-400/80 uppercase tracking-widest font-bold text-[11px]">
                                        <span>
                                            {t('cart.discount')} ({voucher.code})
                                        </span>
                                        <span>-{formatCurrency(discountAmount())}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-white/40 uppercase tracking-widest font-bold text-[11px]">
                                    <span>{t('cart.shipping')}</span>
                                    <span className="text-white/80">{formatCurrency(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <span className="text-white/70 font-bold uppercase tracking-[0.2em] text-[14px]">{t('cart.estimatedTotal')}</span>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[12px] text-white/30 font-bold">{currency}</span>
                                            <span className="text-white font-black text-[28px] leading-none">
                                                {formatCurrency(totalPrice() + shippingCost).replace(/[A-Z]+/, '').trim()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LEFT COLUMN: Shipping & Payment (Appears at BOTTOM on mobile) */}
                    <div className={cn("flex-1 py-12 order-2 lg:order-1", language === 'ar' ? "lg:pl-16" : "lg:pr-16")}>
                        <form onSubmit={handleCheckout} className="space-y-12">
                            {/* 1. Contact */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-[18px] font-bold text-white uppercase tracking-tight">{t('checkout.contact')}</h2>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={t('checkout.email')}
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 focus:ring-0 outline-none transition-all placeholder:text-white/40 text-[14px] text-white"
                                    />
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="peer w-4 h-4 border-white/20 rounded-[3px] accent-white" defaultChecked />
                                        <span className="text-[13px] text-white/70">{t('checkout.news')}</span>
                                    </label>
                                </div>
                            </section>

                            {/* 2. Shipping */}
                            <section>
                                <h2 className="text-[18px] font-bold text-white uppercase tracking-tight mb-6">{t('checkout.delivery')}</h2>
                                
                                <div className="space-y-4">
                                    <div className="relative">
                                        <select 
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full h-[52px] px-4 rounded-[4px] border border-white/20 bg-[#1A0306] text-white text-[14px] appearance-none outline-none focus:border-white font-medium"
                                        >
                                            <option value="Qatar">{language === 'ar' ? "قطر" : "Qatar"}</option>
                                            <option value="Saudi Arabia">{language === 'ar' ? "المملكة العربية السعودية" : "Saudi Arabia"}</option>
                                            <option value="UAE">{language === 'ar' ? "الإمارات العربية المتحدة" : "UAE"}</option>
                                            <option value="Kuwait">{language === 'ar' ? "الكويت" : "Kuwait"}</option>
                                            <option value="Oman">{language === 'ar' ? "عمان" : "Oman"}</option>
                                            <option value="Bahrain">{language === 'ar' ? "البحرين" : "Bahrain"}</option>
                                        </select>
                                        <div className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px] text-white", language === 'ar' ? "left-4" : "right-4")}>▼</div>
                                    </div>

                                    <input
                                        placeholder={language === 'ar' ? "الاسم الكامل" : "Full Name"}
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 outline-none text-[14px] placeholder:text-white/40 text-white"
                                    />

                                    <input
                                        placeholder={language === 'ar' ? "العنوان بالتفصيل (اختياري)" : "Full Address (Optional)"}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 outline-none text-[14px] placeholder:text-white/40 text-white"
                                    />

                                    <div className="grid grid-cols-3 gap-4">
                                        <input
                                            placeholder={language === 'ar' ? "رقم المبنى" : "Building No."}
                                            name="buildingNo"
                                            required
                                            value={formData.buildingNo}
                                            onChange={handleInputChange}
                                            className="h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 outline-none text-[14px] placeholder:text-white/40 text-white"
                                        />
                                        <input
                                            placeholder={language === 'ar' ? "شارع" : "Street"}
                                            name="street"
                                            required
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            className="h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 outline-none text-[14px] placeholder:text-white/40 text-white"
                                        />
                                        <input
                                            placeholder={language === 'ar' ? "رقم المنطقة" : "Zone No."}
                                            name="zoneNo"
                                            required
                                            value={formData.zoneNo}
                                            onChange={handleInputChange}
                                            className="h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 outline-none text-[14px] placeholder:text-white/40 text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <select 
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full h-[52px] px-4 rounded-[4px] border border-white/20 bg-[#1A0306] text-white text-[14px] appearance-none outline-none focus:border-white font-medium"
                                            >
                                                {currentCities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            <div className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px] text-white", language === 'ar' ? "left-4" : "right-4")}>▼</div>
                                        </div>
                                        <input
                                            placeholder={t('checkout.postalCode')}
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className="h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 outline-none text-[14px] placeholder:text-white/40 text-white"
                                        />
                                    </div>

                                    <div className="relative">
                                        <input
                                            placeholder={t('checkout.phone')}
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full h-[52px] px-4 rounded-[4px] border border-white/20 focus:border-white bg-black/20 outline-none text-[14px] placeholder:text-white/40 text-white"
                                        />
                                        <div className={cn("absolute top-1/2 -translate-y-1/2 text-white/40 text-lg cursor-help", language === 'ar' ? "left-4" : "right-4")}>?</div>
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                                        <input type="checkbox" className="w-4 h-4 border-white/20 rounded-[3px] accent-white" />
                                        <span className="text-[13px] text-white/70">{t('checkout.saveInfo')}</span>
                                    </label>
                                </div>
                            </section>

                            {/* 3. Shipping Method */}
                            <section>
                                <h2 className="text-[18px] font-bold text-white uppercase tracking-tight mb-6">{t('checkout.shippingMethod')}</h2>
                                <div className="space-y-3">
                                    {shippingMethods.length > 0 ? shippingMethods.map((method: any) => (
                                        <div 
                                            key={method.id}
                                            onClick={() => setSelectedShippingMethodId(method.id)}
                                            className={cn(
                                                "border rounded-[4px] p-4 flex items-center justify-between cursor-pointer transition-colors",
                                                selectedShippingMethodId === method.id 
                                                    ? "bg-black/40 border-white/80" 
                                                    : "bg-black/20 border-white/20 hover:border-white/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", selectedShippingMethodId === method.id ? "border-white" : "border-white/40")}>
                                                    {selectedShippingMethodId === method.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="text-[13px] font-bold text-white tracking-tight uppercase">{language === 'ar' && method.nameAr ? method.nameAr : method.name}</span>
                                                   <span className="text-[11px] text-white/50 font-medium">{method.duration}</span>
                                                </div>
                                            </div>
                                            <span className="text-[14px] font-bold text-white">{formatCurrency(Number(method.price))}</span>
                                        </div>
                                    )) : (
                                        <div className="bg-black/20 border border-white/20 rounded-[4px] p-4 flex items-center justify-between">
                                            <div className="flex flex-col">
                                               <span className="text-[13px] font-bold text-white tracking-tight uppercase">{t('checkout.express')}</span>
                                               <span className="text-[11px] text-white/50 font-medium">{t('checkout.deliveryTime')}</span>
                                            </div>
                                            <span className="text-[14px] font-bold text-white">{formatCurrency(35)}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* 4. Payment */}
                            <section>
                                <h2 className="text-[18px] font-bold text-white uppercase tracking-tight mb-2">{t('checkout.payment')}</h2>
                                <p className="text-[12px] text-white/50 mb-6 font-medium uppercase tracking-wider">{t('checkout.secureTransactions')}</p>

                                <div className="border border-white/20 rounded-[4px] overflow-hidden">
                                    {isCodEnabled && (
                                        <div
                                            onClick={() => setPaymentMethod("COD")}
                                            className={cn(
                                                "p-5 flex items-center justify-between cursor-pointer transition-colors",
                                                paymentMethod === "COD" ? "bg-black/40" : "hover:bg-black/20"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentMethod === "COD" ? "border-white" : "border-white/40")}>
                                                    {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                </div>
                                                <span className="text-[14px] font-bold text-white uppercase tracking-tight">{t('checkout.cod')}</span>
                                            </div>
                                            <Banknote className="w-5 h-5 text-white/40" />
                                        </div>
                                    )}
                                    <div
                                        onClick={() => setPaymentMethod("CARD")}
                                        className={cn(
                                            "p-5 flex items-center justify-between cursor-pointer transition-colors",
                                            isCodEnabled && "border-t border-white/20",
                                            paymentMethod === "CARD" ? "bg-black/40" : "hover:bg-black/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentMethod === "CARD" ? "border-white" : "border-white/40")}>
                                                {paymentMethod === "CARD" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <span className="text-[14px] font-bold text-white uppercase tracking-tight">{t('checkout.card')}</span>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-white/40" />
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("APPLE_PAY")}
                                        className={cn(
                                            "p-5 border-t border-white/20 flex items-center justify-between cursor-pointer transition-colors",
                                            paymentMethod === "APPLE_PAY" ? "bg-black/40" : "hover:bg-black/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentMethod === "APPLE_PAY" ? "border-white" : "border-white/40")}>
                                                {paymentMethod === "APPLE_PAY" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <span className="text-[14px] font-bold text-white uppercase tracking-tight">Apple Pay</span>
                                        </div>
                                        <div className="flex items-center justify-center h-6 w-10 bg-black rounded-md border border-white/20">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 384 512" fill="currentColor">
                                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("GOOGLE_PAY")}
                                        className={cn(
                                            "p-5 border-t border-white/20 flex items-center justify-between cursor-pointer transition-colors",
                                            paymentMethod === "GOOGLE_PAY" ? "bg-black/40" : "hover:bg-black/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentMethod === "GOOGLE_PAY" ? "border-white" : "border-white/40")}>
                                                {paymentMethod === "GOOGLE_PAY" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <span className="text-[14px] font-bold text-white uppercase tracking-tight">Google Pay</span>
                                        </div>
                                        <div className="flex items-center justify-center h-6 px-2 bg-white rounded-md">
                                            <svg className="h-3 w-auto" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.5 7.14v2.54h3.69c-.15.86-.96 2.5-3.69 2.5-2.22 0-4.04-1.85-4.04-4.14s1.82-4.14 4.04-4.14c1.26 0 2.11.54 2.59 1l1.86-1.89C6.88 1.95 5.34 1.3 3.5 1.3 1.57 1.3 0 2.87 0 4.8c0 1.93 1.57 3.5 3.5 3.5z" fill="#4285f4"/>
                                                <path d="M15.46 4.3v7.35h-2.18V9.6h-.03c-.45.69-1.29 1.05-2.26 1.05-1.74 0-3.32-1.28-3.32-3.15 0-1.92 1.62-3.2 3.42-3.2 1.01 0 1.77.38 2.16.89h.03V4.3h2.18zM11.13 6.36c-1.04 0-1.89.86-1.89 1.98 0 1.08.83 2 1.88 2 1.07 0 1.91-.91 1.91-2s-.85-1.98-1.9-1.98z" fill="#34a853"/>
                                            </svg>
                                            <span className="ml-1 text-[10px] font-black text-black">Pay</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[64px] bg-white hover:bg-white/80 text-[#592C2F] font-black text-[14px] rounded-[2px] shadow-sm transition-all uppercase tracking-[0.2em] mt-8"
                            >
                                {isLoading ? t('checkout.processing') : t('checkout.completeOrder')}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
