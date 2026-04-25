"use client";

import { 
    Search, 
    Bell, 
    User, 
    ChevronDown,
    Activity,
    LayoutGrid,
    Search as SearchIcon
} from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AdminHeader() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <header className="h-16 lg:h-20 bg-black border-b border-white/10 sticky top-0 z-[40] transition-all duration-300">
            <div className="h-full container mx-auto px-4 lg:px-8 flex items-center justify-between gap-6">
                
                {/* Professional Search Bar */}
                <div className="flex-1 max-w-xl hidden md:block relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search for products, orders or customers..."
                        className={cn(
                            "w-full h-10 bg-white/5 border border-white/10 pl-11 pr-4 text-[13px] text-white",
                            "placeholder:text-white/20 rounded-lg outline-none transition-all duration-300",
                            "focus:bg-white/10 focus:border-white/30"
                        )}
                    />
                </div>

                {/* Mobile Search Icon */}
                <div className="md:hidden">
                    <button className="p-2 text-white/60 hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Right Side Actions & Profile */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Status Badge */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live System</span>
                    </div>

                    {/* Notifications */}
                    <button className="p-2 text-white/40 hover:text-white transition-all relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                    </button>

                    <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

                    {/* User Profile Identity */}
                    <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center text-[13px] font-black shadow-lg">
                                 {user?.name?.substring(0, 1) || "B"}
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col text-left">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-extrabold text-white leading-tight">
                                    {user?.name || "Admin"}
                                </span>
                                <ChevronDown className="w-3 h-3 text-white/20 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">
                                {user?.role?.replace('_', ' ') || "Super Admin"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
