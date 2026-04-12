"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "QAR" | "USD" | "EUR" | "GBP";

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (price: number | string) => string;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const EXCHANGE_RATES: Record<Currency, number> = {
    QAR: 1,
    USD: 0.27,
    EUR: 0.25,
    GBP: 0.21
};

const SYMBOLS: Record<Currency, string> = {
    QAR: "QAR",
    USD: "$",
    EUR: "€",
    GBP: "£"
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>("QAR");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedCurrency = localStorage.getItem("localbazar-currency") as Currency;
            if (savedCurrency && EXCHANGE_RATES[savedCurrency]) {
                setCurrency(savedCurrency);
            }
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSetCurrency = (cur: Currency) => {
        setCurrency(cur);
        localStorage.setItem("localbazar-currency", cur);
    };

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        const converted = numPrice * EXCHANGE_RATES[currency];
        const symbol = SYMBOLS[currency];
        
        if (currency === "QAR") {
            return `${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${symbol}`;
        }
        
        return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency: handleSetCurrency,
            formatPrice,
            exchangeRate: EXCHANGE_RATES[currency]
        }}>
            {mounted ? children : <div className="invisible">{children}</div>}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
    return context;
};
