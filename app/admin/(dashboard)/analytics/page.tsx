import { Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-12 bg-[#0e0e0e] rounded-[8px] border border-white/5 shadow-2xl">
            <div className="w-24 h-24 bg-[#592C2F]/10 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-[#592C2F]/20 rounded-full animate-pulse" />
                <Activity className="w-12 h-12 text-[#592C2F] relative z-10" />
            </div>
            <h1 className="text-4xl font-serif font-black text-white tracking-widest mb-6 uppercase italic">Analytique <span className="text-[#592C2F]">Signature</span></h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-lg mb-10 leading-relaxed">
                Le module d'analyse prédictive Local Bazar est en cours de déploiement. Ce portail offrira une vision à 360° sur l'excellence opérationnelle et le désir d'achat de votre clientèle.
            </p>
            <div className="flex items-center gap-4 mb-10 bg-white/5 px-6 py-3 rounded-[4px] text-[10px] font-black text-[#E2D8C5] uppercase tracking-[0.4em] border border-white/5 shadow-inner">
                <ShieldCheck className="w-4 h-4 text-[#592C2F]" />
                Accès Sécurisé • Déploiement en cours
            </div>
            <Button asChild className="bg-[#592C2F] hover:bg-white text-white hover:text-[#592C2F] font-black h-14 px-12 uppercase tracking-[0.2em] transition-all rounded-[4px] border-none shadow-2xl">
                <Link href="/admin">Retour au Dashboard</Link>
            </Button>
        </div>
    );
}
