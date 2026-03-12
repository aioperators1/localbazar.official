import { Store, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function MarketplacePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-12">
            <Card className="max-w-xl border-[#E3E3E3] shadow-sm rounded-xl overflow-hidden bg-white">
                <CardContent className="p-12 flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#F1F1F1] rounded-full flex items-center justify-center mb-6">
                        <Store className="w-8 h-8 text-[#111111]" />
                    </div>
                    <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight mb-4">
                        Marketplace <span className="text-[#616161]">Module</span>
                    </h1>
                    <p className="text-[13px] text-[#616161] font-medium max-w-md mb-8 leading-relaxed">
                        The vendor management and third-party marketplace portal is currently in development. Soon, you will be able to moderate sellers and commission rates centrally.
                    </p>
                    <div className="flex items-center gap-3 mb-10 bg-[#F9F9F9] px-6 py-3 rounded-lg text-[11px] font-bold text-[#8A8A8A] uppercase tracking-widest border border-[#F1F1F1]">
                        <Clock className="w-4 h-4 text-[#111111]" />
                        Deployment In Progress
                    </div>
                    <Button asChild className="bg-[#111111] hover:bg-black text-white font-bold h-11 px-8 rounded-lg shadow-lg transition-all">
                        <Link href="/admin">Return to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
