"use client";

import Script from "next/script";

export function SnapchatPixel({ pixelId }: { pixelId: string }) {
    if (!pixelId) return null;

    return (
        <Script
            id="snap-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                    (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
                    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
                    a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
                    r.src=n;var u=t.getElementsByTagName(s)[0];
                    u.parentNode.insertBefore(r,u);})(window,document,
                    'https://sc-static.net/scevent.min.js');
                    
                    snaptr('init', '${pixelId}');
                `,
            }}
        />
    );
}
