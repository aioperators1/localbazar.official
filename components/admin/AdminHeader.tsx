"use client";

import { Search, Bell, User, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function AdminHeader() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <header className="h-20 border-b border-white/5 bg-[#050505] sticky top-0 z-40 px-10 flex items-center justify-between shrink-0">
            {/* Ultra Pro Command Search */}
            <div className="flex-1 max-w-2xl relative group">
                <div className="absolute inset-0 bg-white/[0.03] rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                <input 
                    type="text"
                    placeholder="Search systems, protocols, or entities..."
                    className="w-full bg-white/[0.03] border border-white/5 pl-14 pr-6 py-4 text-[13px] text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-white/10 focus:ring-4 focus:ring-white/5 transition-all rounded-2xl outline-none h-12"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-widest hidden md:block">
                    CMD + K
                </div>
            </div>

            {/* Premium Status indicators */}
            <div className="flex items-center gap-6 ml-10">
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">System Online</span>
                </div>

                <Button variant="ghost" size="icon" className="h-12 w-12 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                    <Bell className="w-5 h-5" />
                </Button>

                <div className="h-8 w-px bg-white/5 mx-2" />

                <div className="flex items-center gap-4 px-3 py-2 hover:bg-white/5 rounded-2xl cursor-pointer transition-all group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-white text-[#0A0A0A] flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500">
                             {user?.image ? (
                                <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover rounded-xl" />
                             ) : (
                                <User className="w-5 h-5" />
                             )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#050505] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                        <span className="text-[13px] font-black text-white leading-none mb-1 group-hover:translate-x-0.5 transition-transform">{user?.name || "Bader B."}</span>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">{user?.role?.replace('_', ' ') || "Supreme Admin"}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
