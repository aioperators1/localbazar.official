import { FacebookPixel } from "./FacebookPixel";
import { SnapchatPixel } from "./SnapchatPixel";
import { TikTokPixel } from "./TikTokPixel";
import { AdminSetting } from "@/lib/types";

export function PixelScripts({ settings }: { settings: AdminSetting }) {
    return (
        <>
            {settings.facebookPixelId && <FacebookPixel pixelId={settings.facebookPixelId} />}
            {settings.snapchatPixelId && <SnapchatPixel pixelId={settings.snapchatPixelId} />}
            {settings.tiktokPixelId && <TikTokPixel pixelId={settings.tiktokPixelId} />}
        </>
    );
}
