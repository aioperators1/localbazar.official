"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/components/providers/language-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SmoothScroll>
                        {children}
                    </SmoothScroll>
                </NextThemesProvider>
            </LanguageProvider>
        </SessionProvider>
    );
}
