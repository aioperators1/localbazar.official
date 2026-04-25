
"use client";

import { useState } from "react";
import { Truck, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loginDriver } from "./actions";
import { useRouter } from "next/navigation";

export default function DriverLoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const phone = formData.get("phone") as string;
        const password = formData.get("password") as string;

        try {
            const res = await loginDriver(phone, password);
            if (res.success) {
                toast.success("Authentication successful");
                router.push("/driver/dashboard");
            } else {
                toast.error(res.error || "Login failed");
            }
        } catch (error) {
            toast.error("System connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-inter">
            <div className="w-full max-w-sm space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                {/* Brand Logo / Icon */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center shadow-2xl shadow-black/20 mb-6 rotate-3">
                        <Truck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-black tracking-tighter uppercase italic">Logistics Portal</h1>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[3px] mt-2">Carrier Authentication</p>
                </div>

                {/* Form Wrapper */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Registered Phone</label>
                            <Input 
                                name="phone" 
                                type="tel" 
                                required 
                                placeholder="+212 6..." 
                                className="h-14 border-gray-200 rounded-2xl focus:border-black focus:ring-black placeholder:text-gray-300 font-bold text-[15px] transition-all bg-gray-50/30"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Secret Access Code</label>
                            <Input 
                                name="password" 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                className="h-14 border-gray-200 rounded-2xl focus:border-black focus:ring-black placeholder:text-gray-300 font-bold text-[15px] transition-all bg-gray-50/30"
                            />
                        </div>
                        <Button 
                            disabled={loading}
                            className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl font-black uppercase tracking-widest text-[13px] transition-all mt-4 group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Secure Access <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="flex items-center justify-center gap-2 py-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none mt-0.5">End-to-End Encryption Enabled</span>
                </div>
            </div>
            
            {/* Background Decorative Element */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-black opacity-10"></div>
        </div>
    );
}
