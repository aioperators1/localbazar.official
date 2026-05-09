"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { placeExpressOrder, ExpressCheckoutData } from "@/lib/actions/checkout";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/tracking";

interface ExpressCheckoutFormProps {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedSize?: string | null;
    selectedColor?: string | null;
}

export function ExpressCheckoutForm({ productId, productName, price, quantity, selectedSize, selectedColor }: ExpressCheckoutFormProps) {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        city: "",
        address: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data: ExpressCheckoutData = {
            ...formData,
            item: {
                id: productId,
                quantity,
                price,
                size: selectedSize,
                color: selectedColor
            }
        };

        const res = await placeExpressOrder(data);

        if (res.success) {
            // Track Purchase event for Express Checkout
            trackEvent({
                eventName: "Purchase",
                eventId: res.orderId, // Deduplication key
                value: price * quantity,
                currency: "QAR",
                content_ids: [productId],
                content_type: "product",
                contents: [{ id: productId, quantity, price }],
                userData: {
                    phone: formData.phone,
                    firstName: formData.fullName.split(' ')[0],
                    lastName: formData.fullName.split(' ').slice(1).join(' '),
                    city: formData.city
                }
            });

            toast.success(t('checkout.success') || "Order placed successfully!");
            router.push(`/success?orderId=${res.orderId}`);
        } else {
            toast.error(res.error || "Failed to place order.");
        }
        
        setLoading(false);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 mt-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-[18px] font-black text-white uppercase tracking-tight mb-6 text-center">
                {language === 'ar' ? 'معلومات الزبون' : 'Customer Information'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                        className="w-full h-14 px-4 rounded-xl bg-black/20 border border-white/10 focus:border-white/50 text-white placeholder:text-white/30 outline-none transition-colors font-medium text-[14px]"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                        className="w-full h-14 px-4 rounded-xl bg-black/20 border border-white/10 focus:border-white/50 text-white placeholder:text-white/30 outline-none transition-colors font-medium text-[14px]"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={language === 'ar' ? 'المدينة' : 'City'}
                        className="w-full h-14 px-4 rounded-xl bg-black/20 border border-white/10 focus:border-white/50 text-white placeholder:text-white/30 outline-none transition-colors font-medium text-[14px]"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={language === 'ar' ? 'العنوان' : 'Address'}
                        className="w-full h-14 px-4 rounded-xl bg-black/20 border border-white/10 focus:border-white/50 text-white placeholder:text-white/30 outline-none transition-colors font-medium text-[14px]"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-white text-black font-black rounded-xl uppercase tracking-[0.2em] text-[14px] hover:bg-gray-200 transition-colors mt-2 shadow-lg"
                >
                    {loading ? (language === 'ar' ? 'جاري الطلب...' : 'Processing...') : (language === 'ar' ? 'اطلب الآن' : 'Order Now')}
                </button>
            </form>
        </div>
    );
}
