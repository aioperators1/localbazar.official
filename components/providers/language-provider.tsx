"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations.en) => string;
    dir: "ltr" | "rtl";
    isAr: boolean;
    isEn: boolean;
    isFr: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    const updateDirection = (lang: Language) => {
        const dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedLang = localStorage.getItem("electro-lang") as Language;
            if (savedLang && ["en", "fr", "ar"].includes(savedLang)) {
                setLanguage(savedLang);
                updateDirection(savedLang);
            }
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);



    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("electro-lang", lang);
        updateDirection(lang);
    };

    const t = (key: keyof typeof translations.en) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: handleSetLanguage,
            t,
            dir: language === "ar" ? "rtl" : "ltr",
            isAr: language === "ar",
            isEn: language === "en",
            isFr: language === "fr"
        }}>
            {mounted ? children : <div className="invisible">{children}</div>}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
};
