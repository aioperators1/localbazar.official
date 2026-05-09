// Global type declarations for advertising pixel SDKs
// These are injected by third-party scripts and accessed via window.*

interface Window {
    fbq?: (...args: any[]) => void;
    snaptr?: (...args: any[]) => void;
    ttq?: {
        page: () => void;
        track: (event: string, data?: any, options?: any) => void;
        identify: (data: any) => void;
        load: (pixelId: string) => void;
        [key: string]: any;
    };
}
