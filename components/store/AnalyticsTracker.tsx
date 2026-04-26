"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const sessionIdRef = useRef<string>("");

    useEffect(() => {
        // Generate or get session ID from localStorage (persistent across tabs/reloads)
        let sid = localStorage.getItem("store_session_id");
        if (!sid) {
            sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("store_session_id", sid);
        }
        sessionIdRef.current = sid;
    }, []);

    useEffect(() => {
        if (!sessionIdRef.current || !pathname) return;
        
        // Exclude admin pages from analytics
        if (!pathname.startsWith('/admin')) {
            fetch('/api/analytics/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sessionIdRef.current, url: pathname })
            }).catch(() => {});
        }
    }, [pathname]);

    useEffect(() => {
        // Ping every 30 seconds for active users
        const interval = setInterval(() => {
            if (sessionIdRef.current && !pathname?.startsWith('/admin')) {
                fetch('/api/analytics/ping', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: sessionIdRef.current })
                }).catch(() => {});
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [pathname]);

    return null;
}
