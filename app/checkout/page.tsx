"use client";

import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { placeOrder } from "@/lib/actions/checkout";
import { CreditCard, Banknote, CheckCircle2, ArrowRight, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
    { number: 1, title: "Shipping" },
    { number: 2, title: "Payment" },
    { number: 3, title: "Confirm" }
];

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip: ""
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { setMounted(true); }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateStep1 = () => {
        const { firstName, lastName, email, phone, address, city, zip } = formData;
        return firstName && lastName && email && phone && address && city && zip;
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep === 1) {
            if (validateStep1()) setCurrentStep(2);
            else toast.error("Please fill in all shipping fields");
        }
    };

    const handleCheckout = async () => {
        setIsLoading(true);

        const orderData = {
            ...formData,
            items: items.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total: totalPrice(),
            paymentMethod
        };

        const res = await placeOrder(orderData) as any;

        if (res.success) {
            clearCart();
            toast.success("Allocation Complete. System Synchronized.");
            router.push(`/success?orderId=${res.orderId}`);
        } else {
            toast.error(res.error || "Allocation failed. Protocol error.");
        }

        setIsLoading(false);
    };

    if (!mounted) return <div className="p-20 text-center">Loading...</div>;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Cart is Empty</h1>
                <Link href="/shop" className="text-primary hover:underline">Return to Shop</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full border-2 font-black text-xs transition-all duration-700 relative group/step",
                                    currentStep >= step.number
                                        ? "border-indigo-500 bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                        : "border-white/10 bg-black/50 text-zinc-600"
                                )}>
                                    {currentStep > step.number ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <span>{step.number}</span>
                                    )}

                                    {/* Pulse Effect for current step */}
                                    {currentStep === step.number && (
                                        <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />
                                    )}
                                </div>
                                <span className={cn(
                                    "ml-3 font-medium text-sm hidden sm:block",
                                    currentStep >= step.number ? "text-white" : "text-zinc-600"
                                )}>
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "w-12 h-0.5 mx-4",
                                        currentStep > step.number ? "bg-primary" : "bg-zinc-800"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content Form */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-black border border-white/[0.05] rounded-[40px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group"
                        >
                            {/* Ambient Glow - ENSURE NO CLICKS BLOCKED */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                            {currentStep === 1 && (
                                <form id="shipping-form" className="relative z-10 space-y-6" onSubmit={handleNextStep}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin className="text-indigo-500" />
                                        <h2 className="text-xl font-black uppercase tracking-widest text-white">Shipping Details</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">First Name</Label>
                                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" className="bg-white/[0.05] border-white/5 h-12 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Last Name</Label>
                                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Doe" className="bg-white/[0.05] border-white/5 h-12 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className="bg-white/[0.05] border-white/5 h-12 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone Number</Label>
                                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required placeholder="+212 6..." className="bg-white/[0.05] border-white/5 h-12 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Shipping Address</Label>
                                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required placeholder="123 Main St, Casablanca" className="bg-white/[0.05] border-white/5 h-12 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-[10px) font-black uppercase tracking-widest text-zinc-400">City</Label>
                                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Casablanca" className="bg-white/[0.05] border-white/5 h-12 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ZIP Code</Label>
                                            <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} required placeholder="20000" className="bg-white/[0.05] border-white/5 h-12 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[10px] mt-6 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)]">
                                        Continue to Payment <ArrowRight className="ml-3 w-4 h-4" />
                                    </Button>
                                </form>
                            )}

                            {currentStep === 2 && (
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-indigo-500" />
                                        <h2 className="text-xl font-black uppercase tracking-widest text-white">Payment Method</h2>
                                    </div>

                                    <div className="grid gap-6">
                                        <div
                                            onClick={() => setPaymentMethod("COD")}
                                            className={cn(
                                                "cursor-pointer p-6 rounded-3xl border transition-all duration-700 flex items-center justify-between group/pay relative overflow-hidden",
                                                paymentMethod === "COD"
                                                    ? "border-indigo-500/50 bg-indigo-500/[0.03] shadow-[0_0_40px_rgba(99,102,241,0.1)]"
                                                    : "border-white/[0.05] hover:border-white/20 bg-white/[0.01]"
                                            )}
                                        >
                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700",
                                                    paymentMethod === "COD" ? "bg-indigo-500 text-white shadow-lg" : "bg-zinc-900 text-zinc-500"
                                                )}>
                                                    <Banknote className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black uppercase tracking-widest text-sm text-white">Cash on Delivery</h3>
                                                    <p className="text-[10px] text-zinc-500 font-mono tracking-widest mt-1 uppercase">Pay upon delivery</p>
                                                </div>
                                            </div>
                                            {paymentMethod === "COD" && (
                                                <motion.div layoutId="check" className="relative z-10">
                                                    <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                                                </motion.div>
                                            )}
                                        </div>

                                        <div
                                            className="opacity-30 cursor-not-allowed p-6 rounded-3xl border border-white/[0.05] bg-white/[0.01] flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black uppercase tracking-widest text-sm text-zinc-600">Credit Card</h3>
                                                    <p className="text-[10px] text-zinc-600 font-mono tracking-widest mt-1 uppercase">Coming Soon</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 mt-12">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(1)}
                                            className="flex-1 h-16 rounded-2xl border-white/10 text-zinc-500 hover:bg-white hover:text-black transition-all font-black uppercase tracking-[0.3em] text-[10px]"
                                        >
                                            Reverse Protocol
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleCheckout}
                                            disabled={isLoading}
                                            className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all font-black uppercase tracking-[0.3em] text-[10px]"
                                        >
                                            {isLoading ? "Executing..." : `Commit Allocation • ${new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(totalPrice())}`}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-black border border-white/[0.05] rounded-[40px] p-10 sticky top-28 shadow-2xl relative overflow-hidden group"
                        >
                            {/* Volumetric Backlight */}
                            <div className="absolute inset-0 bg-indigo-500/[0.02] blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

                            <div className="relative z-10">
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] mb-10 text-zinc-500">Order Summary</h3>
                                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-6 p-4 bg-white/[0.01] rounded-3xl border border-white/[0.03] hover:border-white/10 transition-colors">
                                            <div className="w-20 h-20 bg-zinc-950 rounded-2xl overflow-hidden shrink-0 relative p-3">
                                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="font-light text-white text-sm uppercase tracking-wide line-clamp-1">{item.name}</h4>
                                                <div className="flex justify-between items-center mt-3">
                                                    <p className="text-[10px] text-zinc-600 font-mono tracking-widest">UNIT_QTY: {item.quantity}</p>
                                                    <p className="font-mono text-sm font-bold text-indigo-400">
                                                        {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-10 border-t border-white/[0.05] space-y-6">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                                        <span className="text-zinc-500">Subtotal</span>
                                        <span className="text-zinc-200 font-mono italic">
                                            {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(totalPrice())}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                                        <span className="text-zinc-500">Shipping</span>
                                        <span className="text-indigo-400 font-black tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">PREMIUM_FREE</span>
                                    </div>
                                    <div className="h-px bg-white/[0.05] my-6" />
                                    <div className="flex justify-between items-center group/total">
                                        <div className="space-y-1">
                                            <span className="block text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 group-hover/total:text-white transition-colors duration-700">Order Total</span>
                                            <span className="block text-[8px] font-black text-indigo-500/40 uppercase tracking-[0.4em]">SECURE CHECKOUT</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-5xl font-black text-white tracking-tighter italic transition-all duration-700 group-hover/total:text-indigo-400 group-hover/total:scale-105 inline-block origin-right">
                                                {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(totalPrice())}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex items-center justify-center gap-3 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">
                                    <Truck className="w-3 h-3 text-indigo-500/50" />
                                    <span>Nationwide Secured Deployment</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
