"use client";

import { Search, Bell, User, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
    return (
        <header className="h-14 border-b border-[#E3E3E3] bg-white sticky top-0 z-40 px-6 flex items-center justify-between shrink-0">
            {/* Left: Search Area */}
            <div className="flex-1 max-w-lg relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#616161]" />
                <input 
                    type="text"
                    placeholder="Search for orders, products or customers..."
                    className="w-full bg-[#F1F1F1] border border-transparent pl-10 pr-4 py-2 text-[13px] text-[#303030] placeholder-[#616161] focus:bg-white focus:border-[#D2D2D2] focus:ring-4 focus:ring-[#303030]/5 transition-all rounded-lg outline-none h-9"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 ml-6">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#616161] hover:bg-[#F1F1F1] rounded-lg">
                    <Bell className="w-4 h-4" />
                </Button>
                <div className="h-6 w-px bg-[#E3E3E3] mx-1" />
                <div className="flex items-center gap-3 px-2 py-1.5 hover:bg-[#F1F1F1] rounded-lg cursor-pointer transition-all group">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-[#303030] flex items-center justify-center border border-white/10 shadow-sm">
                            <span className="text-white font-black text-xs">B</span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[13px] font-black text-[#303030] leading-none mb-0.5">Bader B.</span>
                        <span className="text-[10px] font-bold text-[#616161] uppercase tracking-wider leading-none">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
