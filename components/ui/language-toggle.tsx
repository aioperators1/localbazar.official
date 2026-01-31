"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-zinc-400 hover:text-white hover:bg-white/10">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 min-w-[8rem]">
                <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className={`cursor-pointer ${language === 'en' ? 'text-blue-500 font-bold' : 'text-zinc-400 focus:text-white focus:bg-white/10'}`}
                >
                    🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage("fr")}
                    className={`cursor-pointer ${language === 'fr' ? 'text-blue-500 font-bold' : 'text-zinc-400 focus:text-white focus:bg-white/10'}`}
                >
                    🇫🇷 Français
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage("ar")}
                    className={`cursor-pointer ${language === 'ar' ? 'text-blue-500 font-bold' : 'text-zinc-400 focus:text-white focus:bg-white/10'} font-sans`}
                >
                    🇲🇦 العربية
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
