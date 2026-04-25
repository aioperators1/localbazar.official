export default function Loading() {
    return (
        <div className="flex-1 w-full min-h-[60vh] flex items-center justify-center fade-in duration-300">
            {/* Very minimal and elegant spinner so the Header/Footer remain visible while content loads */}
            <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-white/30 animate-spin" />
        </div>
    );
}
